import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Admin } from "@/models";
import bcrypt from "bcryptjs";
import validateJwt from "@/utils/validateToken";

interface RequestData {
    name?: string,
    email: string,
    position?: string,
    password: string
}

interface AdminInterface {
    _id: string,
    name: string,
    email: string,
    position: string,
    password: string
}

interface ResponseData {
    message: string,
    admin?: AdminInterface,
    admins?: AdminInterface[]
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

    if (req.method === "POST") {
        try {
            const { name, email, position, password } = req.body as RequestData;

            const existingAdmin = await Admin.findOne({ email });

            if (existingAdmin) {
                return res.status(400).json({
                    message: "Admin with this email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const admin = new Admin({
                name,
                email,
                password: hashedPassword,
                position
            })

            const result = await admin.save();

            const adminData = result.toObject();
            delete adminData.password;

            return res.status(201).json({
                message: "Admin created successfully",
                admin: adminData
            })
        } catch (error) {
            return res.status(500).json({
                message: "An Error Occured"
            })
        }
    } else if (req.method === "GET") {
        Admin.find().select('-password')
            .then(admins => {
                return res.status(200).json({
                message: "Fetched admins successfully",
                admins
                });
            })
            .catch(error => {
                res.status(500).json({ message: "An error occurred" });
            });
    } else {
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).json({ message: `Method ${req.method} not allowed`})
    }
}