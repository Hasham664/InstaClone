import express from 'express';
import isAuthenticated from '../middlewere/isAuthenticated.js';
import upload from '../middlewere/multer.js';
import { addComment, addNewPost, bookMarkPost, deletePost, disLikePost, getAllNotifications, getAllPost, getCommentsOfPost, getNotifications, getUserPost, likePost, markNotificationsRead } from '../controllers/post.controller.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPost);
router.route('/userpost/all').get( isAuthenticated, getUserPost);
router.route('/:id/like').get(isAuthenticated, likePost);
router.route('/:id/dislike').get(isAuthenticated, disLikePost);
router.route('/:id/comment').post(isAuthenticated, addComment);
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route('/:id/bookmark').get(isAuthenticated, bookMarkPost);
router.route('/notifications').get(isAuthenticated,getNotifications);
router.route('/notifications/read').put(isAuthenticated, markNotificationsRead);
router.route('/notifications/all').get(isAuthenticated, getAllNotifications);

export default router;