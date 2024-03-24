import { Assignment, Course } from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utils/connectDb';
import validateJwt from '@/utils/validateToken';

interface AssignmentInterface {
    _id: string;
    courseTitle: string;
    question: string
}

interface ResponseData {
    message: string;
    result?: AssignmentInterface;
}

// Define the API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await db;

    const token: string | undefined = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { valid } = validateJwt(token);

    if (!valid) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === 'POST') {

        try {
            const { courseId, question } = req.body;

            const course = Course.findById(courseId);

            const assignment = new Assignment({
                courseId,
                question
            })

            const result = await assignment.save();

            return res.status(201).json({
                message: "Assingment added successfully",
                result : {
                    _id: result._id,
                    courseTitle: course.courseTitle,
                    question: result.question
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Couldn't add assignment"
            })
        }
        
    } else {
        // Return an error response for unsupported request methods
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
