import mongoose, { Document, ObjectId } from "mongoose";

interface IAssignment extends Document {
    courseId: ObjectId;
    question: string;
}

const AssignmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    question: {
        type: String,
        required: true
    }
})

const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;