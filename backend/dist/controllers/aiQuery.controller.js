"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMetadata = void 0;
const model_1 = require("../model");
const ai_1 = require("../ai");
const extractMetadata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { query } = req.body;
    const firebaseUid = req.uid;
    // Pull up the links from og db
    try {
        const user = yield model_1.UserModel.findOne({ firebaseUid });
        if (!user) {
            return res.status(403).json({
                message: "User not found! Login"
            });
        }
        const links = yield model_1.ContentModel.find({ userId: user._id }).select('link');
        // extract the ogp data using Ai
        const extractedData = yield extractTheMetadataViaAi({ query, links });
        // Adjust this according to the actual structure of extractedData
        // For example, if extractedData.candidates[0].content.parts[0].text exists:
        const data = (_f = (_e = (_d = (_c = (_b = (_a = extractedData === null || extractedData === void 0 ? void 0 : extractedData.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : extractedData;
        const rawData = data;
        const cleaned = rawData
            .trim()
            .replace(/^```json\s*/, '')
            .replace(/```$/, '');
        const jsonData = JSON.parse(cleaned);
        try {
            // store it in DB
            // ⚠ Update the DB with changes only
            model_1.ExtractedLinkModel.deleteMany()
                .then(() => {
                return model_1.ExtractedLinkModel.create(jsonData);
            })
                .then(() => {
                console.log("Deletion and creation done.");
            })
                .catch(err => {
                console.error("Error during delete/create", err);
            });
            res.status(200).json({
                message: 'Extracted Data and Stored in DB. Success!',
                data: jsonData
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Error while Storing in DB!",
                error
            });
        }
    }
    catch (error) {
        console.log(`error in aiQueryController: ${error}`);
        res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
    // make vector embeddings of that data
    // store and query to vector db
});
exports.extractMetadata = extractMetadata;
const extractTheMetadataViaAi = (_a) => __awaiter(void 0, [_a], void 0, function* ({ query = '', links }) {
    // get the links ogp data and extract the data as per query
    const response = yield ai_1.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: `
            query: ${query},
            links: ${links} 
        `,
        config: {
            systemInstruction: `
                You are an expert web data extractor. You are given a user query that defines what to extract, along with a list of link objects. Each object contains a URL (link) and a unique identifier (id).

                For any link that contains "x.com" or "twitter.com", you must call the Twitter oEmbed API using the following format:  
                run this in terminal -> curl https://publish.twitter.com/oembed?url=[link_here]  
                For example:  
                https://publish.twitter.com/oembed?url=https://x.com/mannupaaji/status/1833878491470713108
                and From the response, extract the title and description as follows:
                - The title should be set to the tweet author's name, such as: "Tweet by [author name]", based on the 'author_name' field.
                - The description should capture the main tweet content. Use your intelligence to extract tweet content from the "html" field.

                For any youtube link that contains "youtube.com" or "yout.ube" just get title from head tag and description from metatag.

                For all links that do not contain "x.com" or "twitter.com", you must extract metadata from the <head> section of the HTML using Open Graph Protocol (OGP) tags. Specifically, attempt to extract the following:
                - Use the content of the meta tag with property og:title as the title.
                - Use the content of the meta tag with property og:description as the description.

                If either og:title or og:description is missing, continue looking for alternative OGP tags or standard metadata tags that may contain similar information. For example:
                - If og:title is missing, check for twitter:title, <title>, or any other meta tag that appears to represent the title.
                - If og:description is missing, check for twitter:description, description, or other relevant meta tags that describe the content.

                IMPORTANT: If title and desciption is null, examine the link structure and domain to infer what kind of site it is (e.g. GitHub, YouTube, blog, documentation site), and use your reasoning to identify the most meaningful title or description that appears in the metadata.

                You must not extract content from the HTML <body> or visible page layout. Only use metadata explicitly defined in the <head> section. If you still cannot find suitable metadata, return null for that field.

                Output your results as a JSON array. Each object must contain:
                {
                "id": "<original id>",
                "link": "<original link>",
                "title": "<extracted title or null>",
                "description": "<extracted description or null>"
                }

                Do not include any HTML content, body content, or unrelated page data. Do not summarize, infer, or guess values that are not explicitly present. Only use metadata from the page's head section or from the Twitter oEmbed response. Do not include the original user query in your output.
            `
        }
    });
    return response;
});
