import express from "express";
import { CreateUser, ProfileImageUpload, Login, Logout, refreshToken } from "../controllers/User/UserController.js";
import multer from 'multer';
import path from 'path';
import authenticateJWT from "../middleware/Auth.js";
import { UploadFile } from "../helpers/UploadFile.js";


const Router = express.Router();

Router.post('/', CreateUser)

Router.post('/profile', UploadFile('profile_images'), authenticateJWT, ProfileImageUpload);
Router.post('/login', Login);
Router.get('/logout', authenticateJWT, Logout);
Router.post('/refresh-token', refreshToken)
export default Router