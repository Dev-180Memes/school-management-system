import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Submissions, Course, Assignment } from "@/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await db;

    if (req.method === "GET") {
        const { id } = req.query;

        try {
            const courses = await Course.find({ teacherId: id });
            const courseIds = courses.map(course => course._id);

            const assignments = await Assignment.find({ courseId: { $in: courseIds } }).populate("courseId", "courseTitle -_id");

            const assignmentsWithSubmissions = await Promise.all(assignments.map(async assignment => {
                const submissions = await Submissions.find({ assignmentId: assignment._id }).populate('submittedBy', 'name -_id');
                return { ...assignment.toObject(), submissions };
            }));

            return res.status(200).json({
                message: "Submissions fetched successfully",
                submissions: assignmentsWithSubmissions
            })
        } catch (error) {
            return res.status(500).json({
                message: "Couldn't get submissions"
            })
        }
    }
}