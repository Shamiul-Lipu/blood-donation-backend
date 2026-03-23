import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";

const router = Router();

router.use("/users", UserRouter);

export const allApiRoutes = router;
