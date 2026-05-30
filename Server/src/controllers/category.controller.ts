import { type NextFunction, type Response } from "express";
import * as categoryService from "../services/category.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const categories = await categoryService.getCategories(companyId);
    res.status(200).json({ status: "success", data: categories, message: "ดึงข้อมูลหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const category = await categoryService.getCategoryById(companyId, id as string);
    res.status(200).json({ status: "success", data: category, message: "ดึงข้อมูลหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function saveCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const userId = req.user!.user_id;
    const category = await categoryService.saveCategory(companyId, req.body, userId);
    res.status(200).json({ status: "success", data: category, message: "บันทึกข้อมูลหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    await categoryService.deleteCategory(companyId, id as string);
    res.status(200).json({ status: "success", data: null, message: "ลบข้อมูลหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const members = await categoryService.getCategoryMembers(companyId, id as string);
    res.status(200).json({ status: "success", data: members, message: "ดึงข้อมูลสมาชิกหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function addMemberToCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id, userId } = req.params;
    await categoryService.addMemberToCategory(companyId, id as string, userId as string);
    res.status(200).json({ status: "success", data: null, message: "เพิ่มสมาชิกเข้าหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function removeMemberFromCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id, userId } = req.params;
    await categoryService.removeMemberFromCategory(companyId, id as string, userId as string);
    res.status(200).json({ status: "success", data: null, message: "ลบสมาชิกออกจากหมวดหมู่สำเร็จ" });
  } catch (error) {
    next(error);
  }
}
