import { Router } from 'express';
import {
  saveIntegrationConfig,
  getIntegrationConfig,
  syncWealthboxUsers,
  getWealthboxUsers,
} from '../controllers/integration.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/config', authenticate, saveIntegrationConfig);
router.get('/config/:integrationType', authenticate, getIntegrationConfig);
router.post('/wealthbox/sync', authenticate, syncWealthboxUsers);
router.get('/wealthbox/users', authenticate, getWealthboxUsers);

export default router;