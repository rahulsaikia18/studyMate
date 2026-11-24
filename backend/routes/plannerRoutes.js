import express from 'express';
import {
  getStudyPlan,
  updatePlan,
  generateSchedule,
  addDailyGoal,
  toggleDailyGoal,
  deleteDailyGoal,
} from '../controllers/plannerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getStudyPlan);
router.put('/', updatePlan);
router.post('/generate-schedule', generateSchedule);
router.post('/goals', addDailyGoal);
router.patch('/goals/:goalId/toggle', toggleDailyGoal);
router.delete('/goals/:goalId', deleteDailyGoal);

export default router;
