import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // like, dislike, comment, etc.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // receiver
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, // sender
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const notification = mongoose.model('Notification', notificationSchema);
