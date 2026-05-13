import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/async.middleware';
import { sendSuccess } from '../utils/response';
import Algorithm from '../models/Algorithm';

export const getAlgorithms = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const algorithms = await Algorithm.find();
  sendSuccess(res, { algorithms }, 'Algorithms retrieved successfully', 200);
});

export const getAlgorithmById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const algorithm = await Algorithm.findOne({ algorithmId: req.params.id });
  sendSuccess(res, { algorithm }, 'Algorithm retrieved successfully', 200);
});

export const getAlgorithmsByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const algorithms = await Algorithm.find({ category: req.params.category });
  sendSuccess(res, { algorithms }, 'Algorithms retrieved successfully', 200);
});

export const executeAlgorithm = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Logic to execute algorithm and return steps
  sendSuccess(res, { steps: [] }, 'Algorithm executed successfully', 200);
});

export const getComplexity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const algorithm = await Algorithm.findOne({ algorithmId: req.params.id }).select('timeComplexity spaceComplexity');
  sendSuccess(res, { complexity: algorithm }, 'Complexity retrieved successfully', 200);
});
