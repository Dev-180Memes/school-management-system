import db from "@/utils/connectDb";
import { NextApiRequest, NextApiResponse } from "next";
import { Result } from "@/models";
import validateJwt from "@/utils/validateToken";

interface ResultInterface {
    _id: string,
    courseId: {
        courseTitle: string
    },
    score: number,
    grade: string,
    comment: string
}

interface ResponseData {
    message: string,
    results?: ResultInterface[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
        try {
            const { id } = req.query;

            const results = await Result.find({ studentId: id }).populate("courseId", "courseTitle -_id");

            if (results.length === 0) {
                return res.status(404).json({ message: "No results found for this student" });
            }

            return res.status(200).json({
                message: "Results fetched successfully",
                results: results as ResultInterface[]
            }); 

        } catch (error) {
            return res.status(500).json({
                message: "Couldn't get results"
            });
        }
    }
}