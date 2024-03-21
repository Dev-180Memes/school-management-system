import { NextApiRequest, NextApiResponse } from 'next';
import { Student, Teacher } from '@/models';
import db from '@/utils/connectDb';
import bcrypt from "bcryptjs";
import validateJwt from '@/utils/validateToken';

interface RequestData {
    oldPassword: string,
    newPassword: string
}

interface StudentInterface {
    _id: string,
    name: string,
    email: string,
    teacher: string
}

interface ResponseData {
    message: string,
    students?: StudentInterface[]
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

    if (req.method === "PUT") {
        const { id } = req.query;
        const { oldPassword, newPassword } = req.body as RequestData;

        try {
            const student = await Student.findById(id);

            if (!student) {
                return res.status(400).json({
                    message: "Student not found"
                })
            }

            const isMatch = await bcrypt.compare(oldPassword, student.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid old password"
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            student.password = hashedPassword;

            await student.save();

            return res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to update password" });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        try {
            const deletedStudent = await Student.findByIdAndDelete(id);

            if (!deletedStudent) {
                return res.status(400).json({ message: "Student not found" });
            }

            return res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete Student" });
        }
    } else if (req.method === "GET") {
        // Get students that correspond to a particular teacherId
        const { id } = req.query;

        try {
            const students = await Student.find({ teacherId: id })

            if (!students) {
                return res.status(400).json({ message: "Teacher has no students" });
            }

            const enhancedStudents = await Promise.all(students.map(async (student) => {
                const teacher = await Teacher.findById(student.teacherId).lean();
                delete student.password;
                return {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    teacher: teacher ? teacher.name : "Unknown", // Add the teacher's name or "Unknown"
                };
            }));

            return res.status(200).json({
                message: "Students fetched successfully",
                students: enhancedStudents
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to fetch students"
            })
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}