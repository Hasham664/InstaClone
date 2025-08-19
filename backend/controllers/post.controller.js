import sharp from 'sharp';
import {Post} from '../models/post.model.js';
import cloudinary from '../utils/cloudinary.js';
import {User} from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { notification } from '../models/notification.model.js';

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res
        .status(400)
        .json({ message: 'Please upload an image', success: false });
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      'base64'
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({
      path: 'author',
      select: '-password',
    });

    return res
      .status(200)
      .json({ message: 'New Post added successfully', post, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username profilePicture',
      })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      });
    return res
      .status(200)
      .json({ message: 'Posts found successfully', posts, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username profilePicture',
      })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      });
    return res
      .status(200)
      .json({ message: 'Posts found successfully', posts, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// controllers/post.controller.js

export const likePost = async (req, res) => {
  try {
    const likeKrnewalekiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: 'Post not found', success: false });
    }

    await post.updateOne({ $addToSet: { likes: likeKrnewalekiId } });
    await post.save();

    const user = await User.findById(likeKrnewalekiId).select('username profilePicture');
    const postOwnerId = post.author.toString();

    if (postOwnerId !== likeKrnewalekiId) {
      // 1) persist the notification
      const newNotification = await notification.create({
        type: 'like',
        userId: postOwnerId,               // receiver
        fromUser: likeKrnewalekiId,        // sender
        postId,
        message: `${user.username} liked your post`,
      });

      // 2) populate sender so the client can render avatar/name
      await newNotification.populate('fromUser', 'username profilePicture');

      // 3) emit ONLY to the receiver if online
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', newNotification);
      }
    }

    return res.status(200).json({ message: 'Post liked successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export const disLikePost = async (req, res) => {
  try {
    const likeKrnewalekiId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: 'Post not found', success: false });
    }

    await post.updateOne({ $pull: { likes: likeKrnewalekiId } });
    await post.save();

    const user = await User.findById(likeKrnewalekiId).select('username profilePicture');
    const postOwnerId = post.author.toString();

    if (postOwnerId !== likeKrnewalekiId) {
      // if you want a "dislike" notification to show as well:
      const newNotification = await notification.create({
        type: 'dislike',
        userId: postOwnerId,               // receiver
        fromUser: likeKrnewalekiId,        // sender
        postId,
        message: `${user.username} disliked your post`,
      });

      await newNotification.populate('fromUser', 'username profilePicture');

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', newNotification);
      }
    }

    return res.status(200).json({ message: 'Post disliked successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong', success: false });
  }
};


// export const likePost = async (req, res) => {
//   try {
//     const likeKrnewalekiId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(400)
//         .json({ message: 'Post not found', success: false });
//     }
//     await post.updateOne({ $addToSet: { likes: likeKrnewalekiId } });
//     await post.save();

//     //    socket logic here
//     const user = await User.findById(likeKrnewalekiId).select('username profilePicture');
//     const postOwnerId = post.author.toString();
//     if (postOwnerId !== likeKrnewalekiId) {
//     //  const notification = {
//     //     type: 'like',
//     //     userId: likeKrnewalekiId,
//     //     userDetails: user,
//     //     postId,
//     //     message: `${user.username} liked your post`,
//     //   }
//     await notification.create({
//       type: 'like',
//       userId: postOwnerId,
//       fromUser: likeKrnewalekiId,
//       postId,
//       message: `${user.username} liked your post`,
//     });

//       console.log(notification, 'notification likePost');
//       console.log('postOwnerId', postOwnerId, 'likeKrnewalekiId', likeKrnewalekiId);
      
      
//       const postOwnerSocketId = getReceiverSocketId(postOwnerId);
//       console.log(postOwnerSocketId, 'postOwnerSocketId likePost');
//       io.to(postOwnerSocketId).emit('notification', notification);
      
//     }

//     return res
//       .status(200)
//       .json({ message: 'Post liked successfully', success: true });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Something went wrong' , success: false} );
//   }
// };

// export const disLikePost = async (req, res) => {
//   try {
//     const likeKrnewalekiId = req.id;
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res
//         .status(400)
//         .json({ message: 'Post not found', success: false });
//     }
//     await post.updateOne({ $pull: { likes: likeKrnewalekiId } });
//     await post.save();

//     //    socket logic here
//  const user = await User.findById(likeKrnewalekiId).select('username profilePicture');
//  const postOwnerId = post.author.toString();
//  if (postOwnerId !== likeKrnewalekiId) {
//   //  const notification = {
//   //    type: 'dislike',
//   //    userId: likeKrnewalekiId,
//   //    userDetails: user,
//   //    postId,
//   //    message: `${user.username} disliked your post`,
//   //  };
//   await notification.create({
//       type: 'dislike',
//       userId: postOwnerId,
//       fromUser: likeKrnewalekiId,
//       postId,
//       message: `${user.username} disliked your post`,
//     });
//   //  const postOwnerSocketId = GetReciverSocketId(postOwnerId);
//   const postOwnerSocketId = getReceiverSocketId(postOwnerId);
//   console.log(postOwnerSocketId, 'postOwnerSocketId disLikePost');
//    io.to(postOwnerSocketId).emit('notification', notification);
//  }
//     return res.status(200).json({ message: 'Post disliked successfully', success: true });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Something went wrong ', success: false } );
//   }
// };
// controllers/notificationController.js

export const getNotifications = async (req, res) => {
  try {
    // Only fetch unread notifications for badge count
    const notifications = await notification.find({
      userId: req.id,
      isRead: false,
    })
      .populate('fromUser', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await notification.updateMany(
      { userId: req.id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notifications read' });
  }
};
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notification
      .find({ userId: req.id })
      .populate('fromUser', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};


export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentPersonId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text) {
      return res
        .status(400)
        .json({ message: 'text is required field', success: false });
    }
    const comment = await Comment.create({
      text,
      author: commentPersonId,
      post: postId,
    })
    await comment.populate({
      path: 'author',
      select: 'username profilePicture',
    });
    post.comments.push(comment._id);
    await post.save();
    return res
      .status(200)
      .json({ message: 'Comment added successfully', comment, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      'author',
      'username profilePicture'
    );
    if (!comments) {
      return res
        .status(400)
        .json({ message: 'Comments not found', success: false });
    }

    return res.status(200).json({
      message: 'Comments found successfully',
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: 'Post not found', success: false });
    }
    if (post.author.toString() !== authorId) {
      return res
        .status(403)
        .json({
          message: 'You are not authorized to delete this post',
          success: false,
        });
    }
    await Post.findByIdAndDelete(postId);
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((post) => post.toString() !== postId);
    await user.save();
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: 'Post deleted successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const bookMarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: 'Post not found', success: false });
    }
    const user = await User.findById(authorId);

    let isBookmarked = false;

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      isBookmarked = false;
      return res.status(200).json({
        message: 'Post removed from bookmarked',
        success: true,
        isBookmarked,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      isBookmarked = true;
      return res.status(200).json({
        message: 'Post bookmarked',
        success: true,
        isBookmarked,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

