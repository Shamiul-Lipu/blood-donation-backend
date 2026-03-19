import express, { Request, Response } from "express";
import cors from "cors";
import { allApiRoutes } from "./routes/apiRoutes";

const app = express();
app.use(express.json());

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "App is running",
  });
});

// load all API modules
app.use("/api/v1", allApiRoutes);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;
