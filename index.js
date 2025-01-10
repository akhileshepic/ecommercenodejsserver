import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectToDatabase from "./config/Databaseconfig.js";
import userRoute from "./routes/userRoute.js";
import SliderRoute from "./routes/SliderRoute.js";
import cors from "cors";
import path from 'path';
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(cors());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Welcome to my Express server!");
});

app.use('/api/user', userRoute);
app.use('/api/slider', SliderRoute);

// Connect to the database and start the server
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the application if the database connection fails
    });
