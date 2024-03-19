import { Student } from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";

const JWT_SECRET: string = "FUNAAB_HIGH_SCHOOL";

interface RequestData {
    email: string,
    password: string
}

interface ResponseData {
    message: string,
    token?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    if (req.method === "POST") {
        const { email, password } = req.body as RequestData;

        try {
            const student = await Student.findOne({ email });

            if (!student) {
                return res.status(404).json({
                    message: "Student with this email does not exist"
                })
            }

            const isPasswordValid = await bcrypt.compare(password, student.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Incorrect Password"
                })
            }

            const token = jwt.sign({
                id: student._id,
                name: student.name,
                email: student.email,
                teacherId: student.teacherId,
                account: "student"
            }, JWT_SECRET, {
                expiresIn: "24h"
            });

            return res.status(200).json({
                message: "Student logged in successfully",
                token
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to login"
            })
        }
    }
}