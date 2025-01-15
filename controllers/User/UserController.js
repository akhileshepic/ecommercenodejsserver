
import UserModel from "../../models/UserModel.js";
import { comparePassword, createPassword } from "../../helpers/Hashfunction.js";
import { CreateAccessToken, CreateRefreshToken } from "../../helpers/Webtoken.js";
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import redis from "redis";
const redisClient = redis.createClient();
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
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


        const accessToken = await CreateAccessToken(userCheck._id, res);
        const refreshToken = await CreateRefreshToken(userCheck._id)

        const indiaTime = moment().tz("Asia/Kolkata").format();
        userCheck.lastLogin = indiaTime;
        userCheck.token = accessToken;
        await userCheck.save();
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        res.cookie('accessToken', accessToken, cookiesOption)
        res.cookie('refreshToken', refreshToken, cookiesOption)
        return res.status(200).json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
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

const Logout = async (request, response) => {
    try {
        const userid = request.user //middleware
        console.log(userid)
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie("accessToken", cookiesOption)
        response.clearCookie("refreshToken", cookiesOption)



        return response.json({
            message: "Logout successfully",
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


const refreshToken = async (request, response) => {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]
        console.log(refreshToken)
        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = jwt.verify(refreshToken, process.env.JWT_SECRET)

        if (!verifyToken) {
            return response.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?.id

        const newAccessToken = await CreateAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const userProfile = async (request, response) => {
    try {
        const UserProfile = await UserModel.findById(request.user, '-password -token');
        return response.json({
            message: "UserProfile",
            error: false,
            success: true,
            data: {
                UserProfile
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export { CreateUser, ProfileImageUpload, Login, Logout, refreshToken, userProfile }