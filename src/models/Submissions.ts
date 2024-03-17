import mongoose, { Document, ObjectId } from "mongoose";

interface ISubmissions extends Document {
    assignmentId: ObjectId;
    answer: string;
    score: number;
    submittedBy: ObjectId;
}

const SubmissionsSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
    },
    answer: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: false
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    }
})

const Submissions = mongoose.models.Submissions || mongoose.model<ISubmissions>("Submissions", SubmissionsSchema);

export default Submissions;