import mongoose, { Document } from "mongoose";

interface ITeacher extends Document {
    name: string;
    email: string;
    className: string;
    password: string;
}

const TeacherSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Teacher = mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;