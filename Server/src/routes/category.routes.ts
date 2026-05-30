import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken as any);

router.get("/", categoryController.getCategories as any);
router.get("/:id", categoryController.getCategoryById as any);
router.post("/", categoryController.saveCategory as any);
router.put("/", categoryController.saveCategory as any);
router.delete("/:id", categoryController.deleteCategory as any);

router.get("/:id/members", categoryController.getCategoryMembers as any);
router.post("/:id/members/:userId", categoryController.addMemberToCategory as any);
router.delete("/:id/members/:userId", categoryController.removeMemberFromCategory as any);

export default router;
