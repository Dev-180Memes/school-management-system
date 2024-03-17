import mongoose, { Document, ObjectId } from "mongoose";

interface IStudent extends Document {
    name: String;
    email: String;
    password: String;
    teacherId: ObjectId;
}

const StudentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    }
})

const Student = mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;