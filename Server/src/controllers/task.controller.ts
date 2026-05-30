import { type NextFunction, type Response } from "express";
import * as taskService from "../services/task.service.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const tasks = await taskService.getTasks(companyId);
    res.status(200).json({ status: "success", data: tasks, message: "ดึงข้อมูลงานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const task = await taskService.getTaskById(companyId, id as string);
    res.status(200).json({ status: "success", data: task, message: "ดึงข้อมูลงานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const userId = req.user!.user_id;
    const task = await taskService.createTask(companyId, req.body, userId);
    res.status(201).json({ status: "success", data: task, message: "สร้างงานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const task = await taskService.updateTask(companyId, id as string, req.body);
    res.status(200).json({ status: "success", data: task, message: "อัปเดตงานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    await taskService.deleteTask(companyId, id as string);
    res.status(200).json({ status: "success", data: null, message: "ลบงานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function claimTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const userId = req.user!.user_id;
    const { id } = req.params;
    const task = await taskService.claimTask(companyId, id as string, userId);
    res.status(200).json({ status: "success", data: task, message: "รับงานสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function getAttachments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const attachments = await taskService.getAttachments(companyId, id as string);
    res.status(200).json({ status: "success", data: attachments, message: "ดึงข้อมูลไฟล์แนบสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

export async function addAttachment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const companyId = req.user!.company_id;
    const { id } = req.params;
    const attachment = await taskService.addAttachment(companyId, id as string, req.body);
    res.status(201).json({ status: "success", data: attachment, message: "เพิ่มไฟล์แนบสำเร็จ" });
  } catch (error) {
    next(error);
  }
}
