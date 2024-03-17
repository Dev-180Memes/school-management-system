import { Admin } from "@/models";
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
            const admin = await Admin.findOne({ email });

            if (!admin) {
                return res.status(404).json({
                    message: "Admin with this email does not exist"
                })
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Incorrect Password"
                })
            }

            const token = jwt.sign({
                id: admin._id,
                name: admin.name,
                email: admin.email,
                position: admin.position,
                account: "admin"
            }, JWT_SECRET, {
                expiresIn: "24h"
            });

            return res.status(200).json({
                message: "Admin logged in successfully",
                token
            })
        } catch (error) {
            return res.status(500).json({
                message: "Failed to login"
            })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).json({
            message: `Method ${req.method} not allowed`
        })
    }
}