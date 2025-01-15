import HomeSliderModel from "../../models/HomeSliderModel.js";
import fs from 'fs';
import path from 'path';

const CreatFun = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No files uploaded.",
                error: "No files uploaded.",
            });
        }
        const allimagepath = req.files;

        // Save all file paths in the database
        for (let i = 0; i < allimagepath.length; i++) {
            await HomeSliderModel.create({ image: allimagepath[i].path });
        }

        // Send success response
        return res.status(200).json({
            success: true,
            message: "All files uploaded and saved successfully.",
            data: allimagepath.map(file => file.path), // Returning saved file paths
        });


    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Error hashing password",
            error: error.message || error
        })
    }
}


const getAll = async (req, res) => {
    try {
        const HomeSlider = await HomeSliderModel.find({});
        if (!HomeSlider) {

            res.status(200).json({
                success: false,
                message: "image Not found",
                error: error.message || error
            })
        }

        res.status(200).json({
            success: true,
            message: "image List",
            data: HomeSlider
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error hashing password",
            error: error.message || error
        })
    }
}

const SingleData = async (req, res) => {
    try {
        const image = await HomeSliderModel.findById(req.params.id)
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "image ",
            data: image
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error hashing password",
            error: error.message || error
        })
    }
}
const imageDelete = async (req, res) => {
    try {
        const imagedelete = await HomeSliderModel.findByIdAndDelete(req.params.id)

        if (!imagedelete) {
            return res.status(404).json({
                success: false,
                message: "Image not found or already deleted."
            });
        }

        const fullOldImagePath = path.join(process.cwd(), '/', imagedelete.image);
        console.log(fullOldImagePath)
        if (fs.existsSync(fullOldImagePath)) {
            fs.unlinkSync(fullOldImagePath);
        }
        // If the image is deleted successfully
        return res.status(200).json({
            success: true,
            message: "Image deleted successfully.",
            data: imagedelete,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error hashing password",
            error: error.message || error
        })
    }
}

const updateSlider = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded.",
            });
        }

        const uploadedFile = req.files[0];
        const slider = await HomeSliderModel.findById(id);

        if (!slider) {
            return res.status(404).json({
                success: false,
                message: "Slider not found.",
            });
        }

        // Delete the old file if it exists
        const oldImagePath = path.join(process.cwd(), slider.image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        // Update the slider
        slider.image = uploadedFile.path;
        await slider.save();

        res.status(200).json({
            success: true,
            message: "Slider updated successfully.",
            data: slider,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating slider.",
            error: error.message || error,
        });
    }
};

export { CreatFun, getAll, imageDelete, SingleData, updateSlider }