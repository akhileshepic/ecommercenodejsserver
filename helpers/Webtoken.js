import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config();

const CreateAccessToken = async (id, res) => {
    try {
        return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        // return { success: true, token };  // Return a successful response with the token
    } catch (error) {
        console.error("Error generating token:", error);
        return res.status(500).json({  // Return an error response as JSON
            success: false,
            message: "Failed to create access token",
            error: error.message || error,
        });
    }
};


const CreateRefreshToken = async (id) => {
    try {
        // Refresh token will typically have a longer expiry time (e.g., 7 days)
        return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    } catch (error) {
        console.error("Error generating refresh token:", error);
        return { success: false, message: "Failed to create refresh token", error: error.message || error };
    }
};
export { CreateAccessToken, CreateRefreshToken }
