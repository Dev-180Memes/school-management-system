import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Course } from "@/models"
import validateJwt from "@/utils/validateToken";

interface CourseInterface {
    _id: string,
    courseTitle: string,
    teacherId: string
}

interface ResponseData {
    message: string,
    courses?: CourseInterface[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    // Validate authorization token
    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.method === "DELETE") {
        const { id } = req.query;

        try {
            const deletedCourse = await Course.findByIdAndDelete(id);

            if (!deletedCourse) {
                return res.status(400).json({ message: "Course not found" });
            }

            return res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete course" });
        }
    } else if (req.method === "GET") {
        const { id } = req.query;

        Course.find({ teacherId: id })
            .then(courses => {
                return res.status(200).json({
                    message: "Fetched Courses Successfully",
                    courses
                })
            })
            .catch(err => {
                return res.status(500).json({
                    message: "Couldn't fetch courses"
                })
            })
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}