import { Router } from "express";
import { createProject } from "../controllers/projectController";
const router: Router = Router();
router.post("/create", createProject);
export default router;