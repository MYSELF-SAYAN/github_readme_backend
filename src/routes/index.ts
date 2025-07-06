import { Router } from "express";
import readmeRoute from "./readmeRoute";
import projectRoute from "./projectRoute";
const router: Router = Router();

router.use("/readme", readmeRoute);
router.use("/project", projectRoute);
router.get("/", (req, res) => {
  res.send("hello world");
});

export default router; 