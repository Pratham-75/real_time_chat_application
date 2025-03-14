import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
    try {
        const {senderName, senderId, receiverId, content} = req.body;

        const message = new Message({senderName, senderId, receiverId, content});
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({message: "Error Sending Message", error: error.message});
    }
};

export const getMessages = async (req, res) => {
    try {
        const {receiverId} = req.query;
        const currentUser = req.user.id;

        const messages = await Message.find({
            $or: [
                {senderId: currentUser, receiverId: receiverId},
                {senderId: receiverId, receiverId: currentUser},
            ],
        }).sort({createdAt: 1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message}); 
    }
};