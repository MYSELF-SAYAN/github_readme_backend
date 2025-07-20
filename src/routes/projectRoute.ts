import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController";
const router: Router = Router();
router.post("/", createProject);
router.get("/list", getProjects);
export default router;