import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/async.middleware';
import { sendSuccess } from '../utils/response';
import VisualizationSession from '../models/VisualizationSession';

export const saveSession = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await VisualizationSession.create({
    ...req.body,
    user: req.user.id
  });
  sendSuccess(res, { session }, 'Session saved successfully', 201);
});

export const getSavedSessions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const sessions = await VisualizationSession.find({ user: req.user.id });
  sendSuccess(res, { sessions }, 'Saved sessions retrieved successfully', 200);
});

export const getSessionById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await VisualizationSession.findOne({ _id: req.params.id, user: req.user.id });
  sendSuccess(res, { session }, 'Session retrieved successfully', 200);
});

export const deleteSession = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await VisualizationSession.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  sendSuccess(res, {}, 'Session deleted successfully', 200);
});
