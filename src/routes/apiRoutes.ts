import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
import { RequestRouter } from "../modules/request/request.routes";
import { CampaignRouter } from "../modules/campaign/campaign.routes";

const router = Router();

router.use("/users", UserRouter);
router.use("/requests", RequestRouter);
router.use("/campaigns", CampaignRouter);

export const allApiRoutes = router;
