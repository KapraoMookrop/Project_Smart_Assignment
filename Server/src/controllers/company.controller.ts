import { type NextFunction, type Response } from "express";
import * as companyService from "../services/company.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getCompanies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const role = req.user!.role;
    const companyId = req.user!.company_id;
    const companies = await companyService.getCompanies(role, companyId);
    res.status(200).json({ status: "success", data: companies, message: "ดึงข้อมูลบริษัทสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getCompanyById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const role = req.user!.role;
    const userCompanyId = req.user!.company_id;
    const { id } = req.params;
    const company = await companyService.getCompanyById(userCompanyId, id as string, role);
    res.status(200).json({ status: "success", data: company, message: "ดึงข้อมูลบริษัทสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function saveCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const role = req.user!.role;
    const userCompanyId = req.user!.company_id;
    const company = await companyService.saveCompany(userCompanyId, req.body, role);
    res.status(200).json({ status: "success", data: company, message: "บันทึกข้อมูลบริษัทสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function deleteCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const role = req.user!.role;
    const userCompanyId = req.user!.company_id;
    const { id } = req.params;
    await companyService.deleteCompany(userCompanyId, id as string, role);
    res.status(200).json({ status: "success", data: null, message: "ลบข้อมูลบริษัทสำเร็จ" });
  } catch (error) {
    next(error);
  }
}
