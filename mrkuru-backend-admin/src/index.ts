import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTE IMPORTS
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import productStatusRoutes from "./routes/productStatusRoutes";

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Cross-Origin Resource Policy
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://mrkuru-admin-frontend-rho.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ROUTES
app.use("/dashboard", dashboardRoutes); // http://localhost:3000/dashboard/metrics
app.use("/products", productRoutes); //http://localhost:3000/products
app.use("/productStatus", productStatusRoutes); //http://localhost:

// SERVER
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
