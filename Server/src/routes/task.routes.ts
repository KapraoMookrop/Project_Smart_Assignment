import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken as any);

router.get("/", taskController.getTasks as any);
router.get("/:id", taskController.getTaskById as any);
router.post("/save", taskController.createTask as any);
router.post("/update/:id", taskController.updateTask as any);
router.post("/delete/:id", taskController.deleteTask as any);

router.post("/:id/claim", taskController.claimTask as any);

router.get("/:id/attachments", taskController.getAttachments as any);
router.post("/:id/attachments", taskController.addAttachment as any);

export default router;
