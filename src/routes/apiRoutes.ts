import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
import { RequestRouter } from "../modules/request/request.routes";
import { CampaignRouter } from "../modules/campaign/campaign.routes";
import { DonationRouter } from "../modules/donation/donation.routes";
import { AdminRouter } from "../modules/admin/admin.routes";

const router = Router();

router.use("/users", UserRouter);
router.use("/requests", RequestRouter);
router.use("/campaigns", CampaignRouter);
router.use("/donations", DonationRouter);
router.use("/admin", AdminRouter);

export const allApiRoutes = router;
