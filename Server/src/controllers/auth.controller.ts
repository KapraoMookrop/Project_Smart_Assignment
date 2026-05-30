import { type NextFunction, type Request, type Response } from "express";
import * as authService from "../services/auth.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const response = await authService.login(username, password);
    res.status(200).json({ status: "success", data: response, message: "เข้าสู่ระบบสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.user_id;
    const user = await authService.getCurrentUser(userId);
    res.status(200).json({ status: "success", data: user, message: "ดึงข้อมูลสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Skeleton for logout (Client side usually deletes token)
    res.status(200).json({ status: "success", data: null, message: "ออกจากระบบสำเร็จ" });
  } catch (error) {
    next(error);
  }
}
