import { Router } from "express";
import { syncUserData } from "../controllers/synController";
const router: Router = Router();
router.post("/", syncUserData);
export default router;