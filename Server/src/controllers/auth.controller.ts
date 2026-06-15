import { type NextFunction, type Request, type Response } from "express";
import * as authService from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { ApiResponse } from "../module/app-models.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const response = await authService.login(username, password);
    res.status(200).json(ApiResponse.success(response, "เข้าสู่ระบบสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.user_id;
    const user = await authService.getCurrentUser(userId);
    res.status(200).json(ApiResponse.success(user, "ดึงข้อมูลสำเร็จ"));
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(ApiResponse.success(null, "ออกจากระบบสำเร็จ"));
  } catch (error) {
    next(error);
  }
}
