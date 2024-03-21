import db from "@/utils/connectDb";
import { NextApiRequest, NextApiResponse } from "next";
import { Result, Course, Student } from "@/models";
import validateJwt from "@/utils/validateToken";

interface ResponseData {
    message: string,
    results?: ResultInterface[]
}

interface ResultInterface {
    _id: string,
    courseTitle: string,
    studentName: string,
    score: number,
    grade: string,
    comment: string
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
            const { id } = req.query; // Ensure this matches how you're passing the teacher ID

            const courses = await Course.find({ teacherId: id }).lean();

            if (courses.length === 0) {
                return res.status(404).json({ message: "No courses found for this teacher" });
            }

            const courseTitlesMap = new Map(courses.map(course => [course._id.toString(), course.courseTitle]));

            const results = await Result.find({ courseId: { $in: Array.from(courseTitlesMap.keys()) } }).lean();

            const studentIds = results.map(result => result.studentId);
            const students = await Student.find({ _id: { $in: studentIds } }).lean();
            const studentNamesMap = new Map(students.map(student => [student._id.toString(), student.name]));

            const enhancedResults = results.map(result => ({
                _id: result._id,
                courseTitle: courseTitlesMap.get(result.courseId.toString()) || "Unknown Course",
                studentName: studentNamesMap.get(result.studentId.toString()) || "Unknown Student",
                score: result.score,
                grade: result.grade,
                comment: result.comment
            }));

            return res.status(200).json({
                message: "Results fetched successfully",
                results: enhancedResults
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An error occurred" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
