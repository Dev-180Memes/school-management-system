import db from "@/utils/connectDb";
import { NextApiRequest, NextApiResponse } from "next";
import { Course, Assignment, Submissions } from "@/models";
import validateJwt from "@/utils/validateToken";

export default async function handeler(req: NextApiRequest, res: NextApiResponse) {
    await db;

    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
        const { id } = req.query;

        try {
            const courses = await Course.find({ teacherId: id });
            const courseIds = courses.map(course => course._id);

            const assignments = await Assignment.find({ courseId: { $in: courseIds } });
            const assignmentIds = assignments.map(assignment => assignment._id);

            const submissions = await Submissions.find({ assignmentId: { $in: assignmentIds } })
                .populate("assignmentId", "question")
                .populate("submittedBy", "name");

            return res.status(200).json({
                message: "Submissions fetched successfully",
                data: submissions
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;

        try {
            const submission = await Submissions.findById(id);

            if (!submission) {
                return res.status(404).json({ message: "Submission not found" });
            }

            const { score } = req.body;

            submission.score = score;

            await submission.save();

            return res.status(200).json({
                message: "Score updated successfully"
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}