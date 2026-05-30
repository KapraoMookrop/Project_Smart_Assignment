import { type NextFunction, type Response } from "express";
import * as userService from "../services/user.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const users = await userService.getUsers(companyId);
    res.status(200).json({ status: "success", data: users, message: "ดึงข้อมูลผู้ใช้งานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const user = await userService.getUserById(companyId, id as string);
    res.status(200).json({ status: "success", data: user, message: "ดึงข้อมูลผู้ใช้งานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function saveUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const user = await userService.saveUser(companyId, req.body);
    res.status(200).json({ status: "success", data: user, message: "บันทึกข้อมูลผู้ใช้งานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    await userService.deleteUser(companyId, id as string);
    res.status(200).json({ status: "success", data: null, message: "ลบผู้ใช้งานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    // ensure user can only update their own profile, unless they are admin (skipped full check for simplicity, normally we'd check req.user.user_id === id or role)
    if (req.user!.user_id !== id && req.user!.role !== 'CompanyAdmin') {
       return res.status(403).json({ status: "error", message: "ไม่มีสิทธิ์แก้ไขโปรไฟล์นี้" });
    }

    const profile = await userService.updateProfile(companyId, id as string, req.body);
    res.status(200).json({ status: "success", data: profile, message: "อัปเดตโปรไฟล์สำเร็จ" });
  } catch (error) {
    next(error);
  }
}
