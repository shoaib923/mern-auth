import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import { authRouter } from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const allowedOrigins=['http://localhost:5173']

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from incoming requests
app.use(cors({ origin:allowedOrigins, credentials: true })); // Enable CORS with credentials

// Base route for API check
app.get('/', (req, res) =>  res.send("API is working"));

//API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


// Start the server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
