import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Submissions } from "@/models";
import validateJwt from "@/utils/validateToken";

interface RequestBody {
    assignmentId: string;
    answer: string;
    submittedBy: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await db;

    if (req.method === "POST") {
        const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { valid } = validateJwt(token);

        if (!valid) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { assignmentId, answer, submittedBy } = req.body as RequestBody;

        const submission = new Submissions({
            assignmentId,
            answer,
            submittedBy
        })

        await submission.save();

        return res.status(200).json({
            message: "Submission saved successfully"
        })
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}