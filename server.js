import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import rateLimiter from "./middleware/ratelimit.middleware.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
connectDB();
app.use(express.json());
app.use(rateLimiter)
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
