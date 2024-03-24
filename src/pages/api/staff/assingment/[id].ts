import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import validateJwt from "@/utils/validateToken";
import { Assignment, Course } from "@/models";

// fecth all assignments where the course has a teacherId of the user

interface AssignmentInterface {
    _id: string,
    courseId: {
        courseTitle: string
    },
    question: string,
}

interface ResponseData {
    message: string,
    assignments?: AssignmentInterface[]
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
        const { id } = req.query;

        try {
            const courses = await Course.find({ teacherId: id });

            const courseIds = courses.map(course => course._id);

            const assignments: AssignmentInterface[] = await Assignment.find({ courseId: { $in: courseIds } }).populate('courseId', 'courseTitle -_id');

            return res.status(200).json({
                message: "Fetched Assignments Successfully",
                assignments
            })
        } catch (error) {
            return res.status(500).json({
                message: "Couldn't fetch assignments"
            })
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;

        try {
            const deletedAssignment = await Assignment.findByIdAndDelete(id);

            if (!deletedAssignment) {
                return res.status(400).json({ message: "Assignment not found" });
            }

            return res.status(200).json({ message: "Assignment deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete assignment" });
        }
    
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}