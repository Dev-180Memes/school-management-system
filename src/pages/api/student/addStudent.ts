import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Student, Teacher } from "@/models";
import bcrypt from "bcryptjs";
import validateJwt from "@/utils/validateToken";

interface RequestData {
    name: string,
    email: string,
    teacherId: string,
    password: string
}

interface StudentInterface {
    _id: string,
    name: string,
    email: string,
    teacher: string
}

interface ResponseData {
    message: string,
    student?: StudentInterface,
    students?: StudentInterface[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
        try {
            const { name, email, teacherId, password } = req.body as RequestData;

            const existingAdmin = await Student.findOne({ email });

            if (existingAdmin) {
                return res.status(400).json({
                    message: " with this email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const student = new Student({
                name,
                email,
                password: hashedPassword,
                teacherId
            })

            const result = await student.save();

            const teacher = await Teacher.findById(teacherId).lean();

            const studentData = result.toObject();
            delete studentData.password;

            studentData.teacher = teacher ? teacher.name : "Unknown";

            return res.status(201).json({
                message: "Student created successfully",
                student: studentData
            })
        } catch (error) {
            return res.status(500).json({
                message: "An Error Occured"
            })
        }
    } else if (req.method === "GET") {
        try {
            const students = await Student.find({}).lean();

            const enhancedStudents = await Promise.all(students.map(async (student) => {
                const teacher = await Teacher.findById(student.teacherId).lean();
                delete student.password;
                return {
                    ...student,
                    teacher: teacher ? teacher.name : "Unknown", // Add the teacher's name or "Unknown"
                };
            }));

            return res.status(200).json({
                message: "Students fetched successfully",
                students: enhancedStudents
            })
        } catch (error) {
            return res.status(500).json({
                message: "An Error Occured"
            })
        }
    } else {
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
}