import { Router } from 'express';
import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../controllers/organization.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllOrganizations);
router.get('/:id', authenticate, getOrganizationById);
router.post('/', authenticate, createOrganization);
router.put('/:id', authenticate, updateOrganization);
router.delete('/:id', authenticate, deleteOrganization);

export default router;