import { Router } from "express";
import * as companyController from "../controllers/company.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateToken as any);

router.post("/search", companyController.getCompanies as any);
router.get("/:id", companyController.getCompanyById as any);
router.post("/save", companyController.saveCompany as any);
router.post("/delete/:id", companyController.deleteCompany as any);

export default router;
