import express from "express";
import { multipleImage } from "../helpers/UploadFile.js";
import { CreatFun, getAll, imageDelete } from "../controllers/Category/Category.js";

const Router = express.Router();

Router.post('/', multipleImage('HomeSlider'), CreatFun);
Router.get('/', getAll)
Router.delete('/:id', imageDelete)

export default Router