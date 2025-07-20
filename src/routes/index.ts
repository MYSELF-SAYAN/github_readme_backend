import { Router } from "express";
import readmeRoute from "./readmeRoute";
import projectRoute from "./projectRoute";
import syncRoute from "./syncRoute";
import chatRoute from "./chatRoute";
const router: Router = Router();

router.use("/readme", readmeRoute);
router.use("/project", projectRoute);
router.use("/sync-user", syncRoute);
router.use("/chat", chatRoute);
router.get("/", (req, res) => {
  res.send("hello world");
});

export default router; 