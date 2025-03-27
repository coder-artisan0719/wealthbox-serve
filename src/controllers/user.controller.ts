import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getUserById: RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, organizationId } = req.body;
    
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        role,
        organizationId: organizationId ? Number(organizationId) : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
      },
    });
    
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const changePassword:RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const updateUserOrganization: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { userId } = req.params;
    const { organizationId } = req.body;
    
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    
    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    
    const updatedUser = await prisma.wealthboxUser.update({
      where: { id: parseInt(userId) },
      data: { organizationId },
    });
    
    res.status(200).json({
      message: 'User organization updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};