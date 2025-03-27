import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateUserOrganization,
} from '../controllers/user.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.put('/:userId/organization', authenticate, updateUserOrganization);
router.delete('/:id', authenticate, isAdmin, deleteUser);
router.post('/change-password', authenticate, changePassword);

export default router;