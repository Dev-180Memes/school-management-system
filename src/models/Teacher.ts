import mongoose, { Document } from "mongoose";

interface ITeacher extends Document {
    name: String;
    email: String;
    className: String;
    password: String;
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