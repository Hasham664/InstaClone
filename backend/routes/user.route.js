import express from 'express';
import {
  registerUser,
  login,
  logOut,
  getProfile,
  editProfile,
  getSuggestedUser,
  followOrUnfollow,
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewere/isAuthenticated.js';
import upload from '../middlewere/multer.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(login);
router.route('/logout').get( logOut);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated ,getSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);


export default router;