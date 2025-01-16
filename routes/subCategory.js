

import express from "express";
import { multipleImage, UploadFile } from "../helpers/UploadFile.js";
import authenticateJWT from "../middleware/Auth.js";
import { AddSubCategoryController, getSubCategoryController } from '../controllers/SubCategory/SubCategory.js'
const Router = express.Router();
Router.post('/', UploadFile('SubCategory'), authenticateJWT, AddSubCategoryController);
Router.get('/', authenticateJWT, getSubCategoryController);


export default Router 