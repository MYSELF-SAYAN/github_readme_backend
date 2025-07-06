import { Router } from "express";
import { createReadme } from "../controllers/readmeController";
const router: Router = Router();
router.post("/generate-readme/:projectId", createReadme);
export default router;