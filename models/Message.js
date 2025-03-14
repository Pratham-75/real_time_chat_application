import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderName: {type: String, required: true},
    senderId: {type: mongoose.Schema.Types.ObjectId, required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
}, {timestamps: true});

export default mongoose.model('Message', messageSchema);