import { Teacher } from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Interface } from "readline";

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
            const teacher = await Teacher.findOne({ email });

            if (!teacher) {
                return res.status(404).json({
                    message: "Teacher with this email does not exist"
                })
            }

            const isPasswordValid = await bcrypt.compare(password, teacher.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Incorrect Password"
                })
            }

            const token = jwt.sign({
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                className: teacher.className,
                account: "staff"
            }, JWT_SECRET, {
                expiresIn: "24h"
            });

            return res.status(200).json({
                message: "Teacher logged in successfully",
                token
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to login"
            })
        }
    } else {
        return res.status(405).json({
            message: "Method Not Allowed"
        })
    }
}