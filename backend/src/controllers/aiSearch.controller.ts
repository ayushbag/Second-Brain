import { Request, response, Response } from "express";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
import { MongoClient } from "mongodb";

export const aiSearchRouteController = async (req: Request<{}, {}, { query: string }>, res: Response) => {
    const { query } = req.body;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const dbClient = new MongoClient(process.env.MONGO_URI as string);

        await dbClient.connect().then(() => console.log("DB CONNECTED🔗✅"));

        await ingest({ url: 'http://localhost:5173/app', ai, dbClient }).then(() => {
            const response = chat({ question: query, ai, dbClient });

            res.status(200).json({
                message: `Success`,
                response
            })
        });
    } catch (error) {
        res.status(403).json({
            message: `Error`,
            error
        })
    }
}

const scrapeWebPage = async (url = '') => {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data as string);

    const body = $('body').html();

    return {
        body: body
    };
}

const generateVectorEmbeddings = async ({ text, ai }: {
    text: string,
    ai: GoogleGenAI
}) => {
    const response = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text
    })

    return response.embeddings && response.embeddings[0].values
}

const StoreToDB = async ({ embedding, body, dbClient }: {
    embedding: number[] | undefined,
    body: string,
    dbClient: MongoClient
}) => {
    try {
        const collection = dbClient.db('SecondBrain').collection('WEB_COLLECTION');
        await collection.insertOne({
            embeddings: embedding,
            metadata: [{ body }]
        })
    } catch (error) {
        console.log(error)
    }
}

const ingest = async ({ url = 'localhost:5173/app', ai, dbClient }: {
    url: string,
    ai: GoogleGenAI,
    dbClient: MongoClient
}) => {
    try {
        const { body } = await scrapeWebPage(url);

        const bodyChunks = chunkText(body ?? "", 2000);

        for (const chunk of bodyChunks) {
            const bodyEmbeddings = await generateVectorEmbeddings({ text: chunk, ai });
            await StoreToDB({ embedding: bodyEmbeddings, body: chunk, dbClient })
        }
        console.log(`INGESTING SUCCESS! ✅`)
    } catch (error) {
        console.log(`INGESTING ERROR! ☹`)
    }
}

const chat = async ({ question = '', ai, dbClient }: {
    question: string,
    ai: GoogleGenAI,
    dbClient: MongoClient
}) => {
    const questionEmbedding = await generateVectorEmbeddings({ text: question, ai });

    const collection = dbClient.db('SecondBrain').collection('WEB_COLLECTION');

    const result = await collection.aggregate([
        {
            $vectorSearch: {
                index: "SecondBrain",
                path: "embeddings",
                queryVector: questionEmbedding,
                numCandidates: 100,
                limit: 3
            }
        }
    ]).toArray();

    const body = result.map(doc => doc.metadata?.map((e: any) => e.body));

    const chat = await ai.chats.create({
        model: "gemini-1.5-flash",
        history: [
            {
                role: "model",
                parts: [
                    { text: "You're an AI support agent expert in providing supprt to users on behalf of a webpage. Given the context about page content, reply the user accordingly." }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: 'Im giving you context!'
                    }
                ]
            }
        ]
    })

    const response = await chat.sendMessage({
        message: `
                Query: ${question}\n\n
                Retrived Context: ${body}\n\n
                Retrived Context: Give each div id from body to get content id
            `
    });

    const LLMResponse = {
        message: `🤖: ${response?.candidates?.[0]?.content?.parts?.[0]?.text}`
    };

    return LLMResponse;
}

interface ChunkTextOptions {
    text: string;
    chunkSize: number;
}

function chunkText(text: string, chunkSize: number): string[] {
    if (!text || chunkSize <= 0) return [];

    const words: string[] = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
    }

    return chunks;
}
