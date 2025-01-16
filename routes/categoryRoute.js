

import express from "express";
import { multipleImage, UploadFile } from "../helpers/UploadFile.js";
import authenticateJWT from "../middleware/Auth.js";
import { AddCategoryController, getCategoryController } from '../controllers/Category/CategoryController.js'
const Router = express.Router();
Router.post('/', UploadFile('Category'), authenticateJWT, AddCategoryController);
Router.get('/', authenticateJWT, getCategoryController);


export default Router 