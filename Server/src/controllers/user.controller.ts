import { type NextFunction, type Response } from "express";
import * as userService from "../services/user.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { ApiResponse } from "../module/app-models.js";

export async function getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const users = await userService.getUsers(companyId);
    res.status(200).json(ApiResponse.success(users, "ดึงข้อมูลผู้ใช้งานสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function getUsersByCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { categoryId } = req.params;
    const users = await userService.getUserByCategory(categoryId as string);
    res.status(200).json(ApiResponse.success(users, "ดึงข้อมูลผู้ใช้งานสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function getUsersByCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { companyId } = req.params;
    const users = await userService.getUserByCompany(companyId as string);
    res.status(200).json(ApiResponse.success(users, "ดึงข้อมูลผู้ใช้งานสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const user = await userService.getUserById(companyId, id as string);
    res.status(200).json(ApiResponse.success(user, "ดึงข้อมูลผู้ใช้งานสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function saveUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const user = await userService.saveUser(companyId, req.body);
    res.status(200).json(ApiResponse.success(user, "บันทึกข้อมูลผู้ใช้งานสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    await userService.deleteUser(companyId, id as string);
    res.status(200).json(ApiResponse.success(null, "ลบผู้ใช้งานสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    // ensure user can only update their own profile, unless they are admin
    if (req.user!.user_id !== id && req.user!.role !== 'CompanyAdmin') {
       return res.status(403).json(ApiResponse.error("ไม่มีสิทธิ์แก้ไขโปรไฟล์นี้"));
    }

    const profile = await userService.updateProfile(companyId, id as string, req.body);
    res.status(200).json(ApiResponse.success(profile, "อัปเดตโปรไฟล์สำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const userId = req.user!.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json(ApiResponse.error("กรุณาระบุรหัสผ่านปัจจุบันและรหัสผ่านใหม่"));
    }

    await userService.changePassword(companyId, userId, currentPassword, newPassword);
    res.status(200).json(ApiResponse.success(null, "เปลี่ยนรหัสผ่านสำเร็จ"));
  } catch (error) {
    next(error);
  }
}
