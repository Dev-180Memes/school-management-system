import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { Admin, Teacher } from "@/models";
import bcrypt from "bcryptjs";
import validateJwt from "@/utils/validateToken";

interface ResponseData {
    message: string,
    staff?: StaffInterface
    staffs?: StaffInterface[]
}

interface StaffInterface {
    _id: string,
    name: string,
    email: string,
    className: string
}

interface RequestData {
    name: string,
    email: string,
    className: string,
    password: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    if (req.method === "POST") {
        try {
            const { name, email, className, password } = req.body as RequestData;

            const existingStaff = await Teacher.findOne({ email });

            if (existingStaff) {
                return res.status(400).json({
                    message: "Staff with this email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const staff = new Teacher({
                name,
                email,
                password: hashedPassword,
                className
            })

            const result = await staff.save()

            const staffData = result.toObject();
            delete staffData.password;

            return res.status(201).json({
                message: "Staff created successfully",
                staff: staffData
            })
        } catch (error) {
            return res.status(500).json({
                message: "An Error Occured"
            })
        }
    } else if (req.method === "GET") {
        Teacher.find().select('-password')
            .then(staffs => {
                return res.status(200).json({
                    message: "Fetched all staffs successfully",
                    staffs
                });
            })
            .catch(error => {
                res.status(500).json({ message: "An Error Occurred" });
            })
    } else {
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).json({ message: `Method ${req.method} not allowed` })
    }
}