import CategoryModel from "../../models/category.model.js";

const AddCategoryController = async (request, response) => {
    try {
        // Destructuring 'name' and 'image' from request.body
        const { name } = request.body;
        if (!request.file || request.file.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No files uploaded.",
                error: "No files uploaded.",
            });
        }
        const allimagepath = request.file;
        const image = request.file.path;

        // Check if 'name' and 'image' are provided in the request
        if (!name || !image) {
            return response.status(400).json({
                message: "Both 'name' and 'image' are required fields",
                error: true,
                success: false
            });
        }

        // Create a new category document in the database
        const addCategory = new CategoryModel({
            name,
            image // Assuming image is passed as a file or URL string
        });

        // Save the category to the database
        const saveCategory = await addCategory.save();

        // Check if the category was saved successfully
        if (!saveCategory) {
            return response.status(500).json({
                message: "Category not created due to an internal error",
                error: true,
                success: false
            });
        }

        // Respond with success and the created category data
        return response.json({
            message: "Category successfully added",
            data: saveCategory,
            success: true,
            error: false
        });

    } catch (error) {
        // Handle any unexpected errors
        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            error: true,
            success: false
        });
    }
}


const getCategoryController = async (request, response) => {
    try {

        const data = await CategoryModel.find().sort({ createdAt: -1 })

        return response.json({
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.messsage || error,
            error: true,
            success: false
        })
    }
}


const updateCategoryController = async (request, response) => {
    try {
        const { _id, name, image } = request.body

        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name,
            image
        })

        return response.json({
            message: "Updated Category",
            success: true,
            error: false,
            data: update
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export { AddCategoryController, getCategoryController, updateCategoryController };
