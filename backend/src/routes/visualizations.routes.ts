import { Router } from 'express';
import { saveSession, getSavedSessions, getSessionById, deleteSession } from '../controllers/visualizations.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
router.post('/save', saveSession);
router.get('/saved', getSavedSessions);
router.get('/:id', getSessionById);
router.delete('/:id', deleteSession);

export default router;
