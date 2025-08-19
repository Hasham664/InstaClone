import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversational.model.js";
import {  getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage: messages } = req.body;
        console.log(messages,'message');

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = new Message({
          senderId,
          receiverId,
          messages,
        });
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([
            conversation.save(),
            newMessage.save(),
        ]);
        const reciverSocketId = getReceiverSocketId(receiverId);
        if(reciverSocketId) {
        io.to(reciverSocketId).emit('newMessage',newMessage); 
        }
        return res
            .status(200)
            .json({ message: 'Message sent successfully', newMessage, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};


export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');
        if(!conversation) {
            return res
                .status(200)
                .json({ messages: [], success: true });
        }

        return res
          .status(200).json({ messages: conversation?.messages, success: true,});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};
















