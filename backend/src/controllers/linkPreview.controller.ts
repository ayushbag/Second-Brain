import * as cheerio from 'cheerio';
import { Request, Response } from "express";

export const linkPreviewController = async (req: Request, res: Response) => {
    const { url } = req.body;

    if(!url) {
        res.status(400).json({
            message: "No Link Provided"
        })
        return;
    } 

    try {
        const resp = await fetch(url);
        const html = await resp.text();
        const $ = cheerio.load(html);

        const title = $("title").text();
        const description = $('meta[name="description"]').attr("content") || "";
        const image = $('meta[property="og:image"]').attr("content") || $('meta[property="tweet:image"]').attr("content") || "";

        res.status(200).json({
            message: "Successful",
            data: { title, description, image }
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server issue",
            error: (error as Error).message || "Unknown error"
        })
    }
}