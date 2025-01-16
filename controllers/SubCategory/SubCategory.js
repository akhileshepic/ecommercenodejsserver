import SubCategoryModel from "../../models/subCategory.js";
import mongoose from "mongoose";

const AddSubCategoryController = async (request, response) => {
    try {
        const { name, category } = request.body;

        // Check if a file is uploaded
        if (!request.file || !request.file.path) {
            return response.status(400).json({
                success: false,
                message: "Image is required.",
                error: "No file uploaded.",
            });
        }

        const image = request.file.path;
        const categoryArray = typeof category === "string" ? JSON.parse(category) : category; // Parse if category is a string // Split the string into an array


        if (!name && !image && !category[0]) {
            return response.status(400).json({
                message: "Provide name, image, category",
                error: true,
                success: false
            })
        }

        // Prepare payload
        const payload = {
            name,
            image,
            category: categoryArray,
        };

        // Save to database
        const createSubCategory = new SubCategoryModel(payload);
        const save = await createSubCategory.save();

        return response.status(201).json({
            message: "Sub Category Created",
            data: save,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            error: true,
            success: false,
        });
    }
};
const getSubCategoryController = async (request, response) => {
    try {
        const data = await SubCategoryModel.find().sort({ createdAt: -1 }).populate('category')
        return response.json({
            message: "Sub Category data",
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export { AddSubCategoryController, getSubCategoryController };
