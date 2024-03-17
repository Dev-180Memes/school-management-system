import mongoose, { Document, ObjectId } from "mongoose";

interface IClassNotification extends Document {
    notification: String;
    postedBy: ObjectId;
}

const ClassNotificationSchema = new mongoose.Schema({
    notification: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    }
})

const ClassNotification = mongoose.models.ClassNotification || mongoose.model<IClassNotification>("ClassNotification", ClassNotificationSchema);

export default ClassNotification;