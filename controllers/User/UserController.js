
import UserModel from "../../models/UserModel.js";
import { comparePassword, createPassword } from "../../helpers/Hashfunction.js";
import { CreateAccessToken } from "../../helpers/Webtoken.js";
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import redis from "redis";
const redisClient = redis.createClient();
const CreateUser = async (req, res) => {
    try {

        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: "Name, email, and password are required fields",
            });
        }
        const userCheckExist = await UserModel.findOne({ email: email }); // Await the result

        if (userCheckExist) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: "Email already exists",
            });
        }
        const newPassword = await createPassword(password)
        if (!newPassword.success) {
            return res.status(500).json({ success: false, message: "Error creating password", error: newPassword.error });
        }
        const payLoad = {
            name: name,
            email: email,
            password: newPassword?.hashedPassword
        };

        const user = await UserModel.create(payLoad)
        const token = await CreateAccessToken(user._id, res)
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            token
        });

    } catch (error) {

        res.status(200).json({
            success: false,
            message: "Error hashing password",
            error: error.message || error
        })
    }
}

const ProfileImageUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Find the user by ID (using the user ID from the JWT payload)
        const user = await UserModel.findById(req.user); // Assuming req.user contains user info

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projectRoot = process.cwd();  // Get the current working directory (project root)
        const uploadFolder = path.join(projectRoot, 'uploads');
        console.log("Upload Folder:", uploadFolder);  // Log the upload folder path

        // If the user already has a profile image, remove the old image
        if (user.profileImage) {
            const fullOldImagePath = path.join(process.cwd(), '/', user.profileImage);
            // Check if the old image exists and remove it
            if (fs.existsSync(fullOldImagePath)) {
                // File exists, so delete it
                console.log(`Deleting old image: ${fullOldImagePath}`);
                fs.unlinkSync(fullOldImagePath); // Delete the old image from the server
            }
        }  // Update the user's profile image URL (store the file path or URL of the uploaded image)
        user.profileImage = req.file.path; // Or if you're storing a URL: user.profileImage = `http://example.com/uploads/${req.file.filename}`;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Profile image updated successfully!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage, // Send the updated profile image,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Something went wrong during profile image update', error: error.message });
    }

    //check password


}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: "email and password are required fields",
            });
        }

        const userCheck = await UserModel.findOne({ email: email });
        if (!userCheck) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isPasswordMatch = await comparePassword(password, userCheck.password);
        if (!isPasswordMatch.isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                error: "These credentials do not match our records.",
            });
        }


        const token = await CreateAccessToken(userCheck._id, res);
        const indiaTime = moment().tz("Asia/Kolkata").format();
        userCheck.lastLogin = indiaTime;
        await userCheck.save();
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: 'production',
            maxAge: 3600000, // 1 hour
            sameSite: 'strict',
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                name: userCheck.name,
                email: userCheck.email,
                phone: userCheck.phone,
                lastLogin: userCheck.lastLogin,
            },
            token,
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const Logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }
        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}
export { CreateUser, ProfileImageUpload, Login, Logout }