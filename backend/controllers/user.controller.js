import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please fill all the fields', success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'User already exists', success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ message: 'User created successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: 'Incorrect password', success: false });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      posts: populatedPost,
      followers: user.followers,
      following: user.following,
    };

    return res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'None', // instead of 'strict'
        secure: true, // Set to true if using HTTPS
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      })
    // return res
    //   .cookie('token', token, {
    //     httpOnly: true,
    //     sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    //     secure: process.env.NODE_ENV === 'production',
    //     maxAge: 24 * 60 * 60 * 1000,
    //   })
      .status(200)
      .json({
        message: `Welcome back ${user.username}`,
                
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie('token');
    return res
      .status(200)
      .json({ message: 'Logged out successfully', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({ path: 'posts', createdAt: -1 })
      .populate('bookmarks');
    return res
      .status(200)
      .json({ message: 'User found successfully', success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { gender, bio } = req.body;
    const proFilePicture = req.file;
    let cloudResponse;
    if (proFilePicture) {
      const fileUri = getDataUri(proFilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not found', success: false });
    }
    if (cloudResponse) {
      user.profilePicture = cloudResponse.secure_url;
    }
    if (gender) {
      user.gender = gender;
    }
    if (bio) {
      user.bio = bio;
    }
    await user.save();
    return res
      .status(200)
      .json({ message: 'Profile updated successfully', success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.id } }).select('-password');
    if (!users) {
      return res
        .status(400)
        .json({ message: 'Users not found', success: false });
    }
    return res.status(200).json({
      message: 'Users found successfully',
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskoFollowKrunga = req.params.id;
    if (followKrneWala === jiskoFollowKrunga) {
      return res
        .status(400)
        .json({ message: 'You cannot follow yourself', success: false });
    }
    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);
    if (!user || !targetUser) {
      return res
        .status(400)
        .json({ message: 'User not found', success: false });
    }

    const isFollowWing = user.following.includes(jiskoFollowKrunga);

    if (isFollowWing) {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: 'User unfollowed successfully', success: true });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: 'User followed successfully', success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
