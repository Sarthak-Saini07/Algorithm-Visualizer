import { Router } from 'express';
import { getAlgorithms, getAlgorithmById, getAlgorithmsByCategory, executeAlgorithm, getComplexity } from '../controllers/algorithms.controller';

const router = Router();

router.get('/', getAlgorithms);
router.get('/:id', getAlgorithmById);
router.get('/category/:category', getAlgorithmsByCategory);
router.post('/execute', executeAlgorithm);
router.get('/complexity/:id', getComplexity);

export default router;
