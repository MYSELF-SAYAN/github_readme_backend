import { Router } from "express";
import { chatWithAI } from "../controllers/chatController";
const router: Router = Router();
router.post("/", chatWithAI);
export default router;