import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/connectDb";
import { ClassNotification } from "@/models";

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

    if (req.method === "GET") {
        const { id } = req.query;

        // Fetch all notifications where postedBy is equal to the id
        ClassNotification.find({ postedBy: id })
            .then(notifications => {
                return res.status(200).json({
                    message: "Notifications fetched successfully",
                    notifications
                })
            })
            .catch(() => {
                return res.status(500).json({
                    message: "Couldn't get notifications"
                })
            })
    }
}