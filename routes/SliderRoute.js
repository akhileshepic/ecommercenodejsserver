import express from "express";
import { multipleImage } from "../helpers/UploadFile.js";
import { CreatFun, getAll, imageDelete, SingleData, updateSlider } from "../controllers/HomeSlider/HomeSlider.js";
import authenticateJWT from "../middleware/Auth.js";

const Router = express.Router();

Router.post('/', multipleImage('HomeSlider'), authenticateJWT, CreatFun);

Router.put('/:id', multipleImage('HomeSlider'), authenticateJWT, updateSlider);
Router.get('/', authenticateJWT, getAll)
Router.get('/:id', authenticateJWT, SingleData)
Router.delete('/:id', authenticateJWT, imageDelete)

export default Router 