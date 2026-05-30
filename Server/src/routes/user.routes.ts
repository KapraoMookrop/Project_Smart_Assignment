import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken as any);

router.get("/", userController.getUsers as any);
router.get("/:id", userController.getUserById as any);
router.post("/", userController.saveUser as any);
router.put("/", userController.saveUser as any);
router.delete("/:id", userController.deleteUser as any);

router.put("/:id/profile", userController.updateProfile as any);

export default router;
