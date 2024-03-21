import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Result, Course, Student } from "@/models";
import validateJwt from "@/utils/validateToken";

interface RequestData {
    courseId: string,
    studentId: string,
    score: number,
    comment: string
}

interface ResponseData {
    message: string,
    student?: {
        _id: string,
        courseTitle: string,
        studentNmae: string,
        score: number,
        grade: string,
        comment: string
    }
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
    
    if (req.method === "POST") {

        try {
            const { courseId, studentId, score, comment } = req.body as RequestData;

            const course = await Course.findById(courseId);
            const student = await Student.findById(studentId);

            if (!course || !student) {
                return res.status(404).json({
                    message: "Course or student not found"
                })
            }

            let grade: string;

            if (score >= 70) {
                grade = "A"
            } else if (score >= 60 && score <= 69) {
                grade = "B"
            } else if (score >= 50 && score <= 59) {
                grade = "C"
            } else if (score >= 45 && score <= 49) {
                grade = "D"
            } else if (score >= 40 && score <= 44) {
                grade = "E"
            } else {
                grade = "F"
            }

            const resultData = new Result({
                courseId,
                studentId,
                score,
                grade,
                comment
            })

            const result = await resultData.save();

            return res.status(201).json({
                message: "Result added successfully",
                student: {
                    _id: result._id,
                    courseTitle: course.courseTitle,
                    studentNmae: student.name,
                    score: result.score,
                    grade: result.grade,
                    comment: result.comment
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Couldn't upload result"
            })
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({
            message: `Method ${req.method} not allowed`
        })
    }
}