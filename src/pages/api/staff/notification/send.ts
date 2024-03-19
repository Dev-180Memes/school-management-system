import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { ClassNotification } from "@/models";
import validateJwt from "@/utils/validateToken";
import { ObjectId } from "mongoose";

interface RequestData {
    notification: string,
    postedBy: ObjectId
}

interface NotificationInterface {
    _id: string,
    notification: string,
    postedBy: string
}

interface ResponseData {
    message: string,
    notifications?: NotificationInterface[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    if (req.method === "POST") {
        const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { valid } = validateJwt(token);

        if (!valid) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const { notification, postedBy } = req.body as RequestData;

            const notificationData = new ClassNotification({
                notification,
                postedBy
            })

            await notificationData.save();

            return res.status(201).json({
                message: "Notification sent successfully"
            })
        } catch (error) {
            return res.status(500).json({
                message: "Couldn't send notification"
            })
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({
            message: `Method ${req.method} not allowed`
        })
    }
}