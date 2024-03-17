import mongoose, { Document, ObjectId } from "mongoose";

interface IResult extends Document {
    courseId: ObjectId;
    studentId: ObjectId;
    score: Number;
    grade: String;
    comment: String;
}

const ResultSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
    },
    score: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

const Result = mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);

export default Result;