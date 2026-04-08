import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
import { RequestRouter } from "../modules/request/request.routes";

const router = Router();

router.use("/users", UserRouter);
router.use("/requests", RequestRouter);

export const allApiRoutes = router;
