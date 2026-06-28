import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken as any);

router.post("/search", userController.getUsers as any);
router.post("/search/category/:categoryId", userController.getUsersByCategory as any);
router.post("/search/company/:companyId", userController.getUsersByCompany as any);
router.get("/:id", userController.getUserById as any);
router.post("/save", userController.saveUser as any);
router.post("/delete/:id", userController.deleteUser as any);

router.post("/profile/update/:id", userController.updateProfile as any);
router.post("/profile/change-password", userController.changePassword as any);

export default router;
