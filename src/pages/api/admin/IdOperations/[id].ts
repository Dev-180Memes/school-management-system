import { NextApiRequest, NextApiResponse } from 'next';
import { Admin } from '@/models';
import db from '@/utils/connectDb';
import bcrypt from "bcryptjs";
import validateJwt from '@/utils/validateToken';

interface ResponseData {
    message: string;
}

interface RequestData {
    oldPassword: string,
    newPassword: string
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

    if (req.method === "DELETE") {
        const { id } = req.query;

        try {
            const deletedAdmin = await Admin.findByIdAndDelete(id);

            if (!deletedAdmin) {
                return res.status(400).json({ message: "Admin not found" });
            }

            return res.status(200).json({ message: "Admin deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete Admin" });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;
        const { oldPassword, newPassword } = req.body;

        try {
            const admin = await Admin.findById(id);

            if (!admin) {
                return res.status(400).json({
                    message: "Admin not found"
                })
            }

            const isMatch = await bcrypt.compare(oldPassword, admin.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: "Old Password Incorrect"
                })
            }
            
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            admin.password = hashedPassword;
            await admin.save();

            return res.status(200).json({
                message: "Password changed successfully"
            })
        } catch (error) {
            
        }
    }
}
