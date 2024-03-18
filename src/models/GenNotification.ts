import mongoose, { Document, ObjectId } from "mongoose";

interface IGenNotification extends Document {
    notification: string;
    postedBy: ObjectId;
}

const GenNotificationSchema = new mongoose.Schema({
    notification: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    }
})

const GenNotification = mongoose.models.GenNotification || mongoose.model<IGenNotification>("GenNotification", GenNotificationSchema);

export default GenNotification;