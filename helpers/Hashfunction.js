import bcrypt from "bcrypt";
const saltRounds = 10;

const createPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return { success: true, hashedPassword }; // Return the hashed password with a success flag
    } catch (error) {
        console.error("Error hashing password:", error);
        return { success: false, message: "Error hashing password", error: error.message }; // Return a JSON object on error
    }
};

const comparePassword = async (plaintextPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
        return { success: true, isMatch }; // Return comparison result with success flag
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return { success: false, message: "Error comparing passwords", error: error.message }; // Return JSON on error
    }
}

export { createPassword, comparePassword }