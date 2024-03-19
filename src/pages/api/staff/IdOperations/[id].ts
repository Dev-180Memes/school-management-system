import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Teacher, Course } from "@/models";
import bcrypt from "bcryptjs";
import validateJwt from "@/utils/validateToken";

interface RequestData {
    oldPassword: string,
    newPassword: string
}

interface ResponseData {
    message: string
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
            const teacher = await Teacher.findById(id);

            if (!teacher) {
                return res.status(400).json({
                    message: "Teacher not found"
                })
            }

            const isMatch = await bcrypt.compare(oldPassword, teacher.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid old password"
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            teacher.password = hashedPassword;

            await teacher.save();

            return res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to update password" });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;

        try {
            const deletedTeacher = await Teacher.findByIdAndDelete(id);

            if (!deletedTeacher) {
                return res.status(400).json({ message: "Teacher not found" });
            }

            return res.status(200).json({ message: "Teacher deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete teacher" });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}