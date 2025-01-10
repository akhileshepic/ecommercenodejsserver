import express from "express";
import { multipleImage } from "../helpers/UploadFile.js";
import { CreatFun, getAll, imageDelete } from "../controllers/Category/Category.js";
import authenticateJWT from "../middleware/Auth.js";

const Router = express.Router();

Router.post('/', multipleImage('HomeSlider'), authenticateJWT, CreatFun);
Router.get('/', authenticateJWT, getAll)
Router.delete('/:id', authenticateJWT, imageDelete)

export default Router