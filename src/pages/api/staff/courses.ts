import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import validateJwt from "@/utils/validateToken";
import { ObjectId } from "mongoose";
import { Course } from "@/models";

interface RequestData {
    courseTitle: string,
    teacherId: ObjectId
}

interface CourseInterface {
    _id: string,
    courseTitle: string,
    teacherId: string
}

interface ResponseData {
    message: string,
    course?: CourseInterface,
    courses?: CourseInterface[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await db;

    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
        const { courseTitle, teacherId } = req.body as RequestData;

        const courseData = new Course({
            courseTitle,
            teacherId
        })

        const course = await courseData.save();

        return res.status(201).json({
            message: "Course added Successfully",
            course: course
        })
    } else {
        res.status(405).json({
            message: "Method not allowed"
        })
    }
}