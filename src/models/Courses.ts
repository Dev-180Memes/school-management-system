import mongoose, { Document, ObjectId } from "mongoose";

interface ICourse extends Document {
    courseTitle: string;
    teacherId: ObjectId;
}

const CourseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    }
})

const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;