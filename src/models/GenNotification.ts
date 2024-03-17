import mongoose, { Document, ObjectId } from "mongoose";

interface IGenNotification extends Document {
    notification: String;
    teacherId: ObjectId;
}

const GenNotificationSchema = new mongoose.Schema({
    notification: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    }
})

const GenNotification = mongoose.models.GenNotification || mongoose.model<IGenNotification>("GenNotification", GenNotificationSchema);

export default GenNotification;