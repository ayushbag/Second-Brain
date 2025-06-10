import { Request, Response } from "express";

export const aiQueryController = (req: Request, res: Response) => {
    const { query } = req.body;

    // Pull up the links from db
    // extract the ogp data using ai
    // make vector embeddings of that data
    // store and query to vector db
}