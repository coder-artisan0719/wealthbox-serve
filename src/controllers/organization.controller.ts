import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { organizationSchema } from '../utils/validationSchemas';

const prisma = new PrismaClient();

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const organizations = await prisma.organization.findMany({
      where: { userId: userId },
    });
    
    res.status(200).json(organizations);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getOrganizationById:RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const organization = await prisma.organization.findUnique({
      where: { id: Number(id), userId: userId },
    });
    
    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    
    res.status(200).json(organization);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const createOrganization: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const validatedData = organizationSchema.parse(req.body);

    if (validatedData.name.length > 50) {
      res.status(400).json({ message: 'Organization name cannot exceed 50 characters' });
      return;
    }

    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: 'insensitive'
        },
        userId: {
          equals: userId,
        },
      }
    });

    if (existingOrg) {
      res.status(400).json({ message: 'Organization name must be unique' });
      return;
    }
    
    const organization = await prisma.organization.create({
      data: {
        ...validatedData,
        userId,
      }
    });
    
    res.status(201).json(organization);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const updateOrganization: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const existingOrganization = await prisma.organization.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingOrganization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    
    if (existingOrganization.userId !== userId) {
      res.status(403).json({ message: 'You do not have permission to update this organization' });
      return;
    }

    const validatedData = organizationSchema.parse(req.body);

    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: 'insensitive'
        },
        id: {
          not: Number(id)
        },
        userId: userId,
      }
    });

    if (existingOrg) {
      res.status(400).json({ message: 'Organization name must be unique' });
      return;
    }
    
    const organization = await prisma.organization.update({
      where: { id: Number(id) },
      data: validatedData,
    });
    
    res.status(200).json(organization);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const organization = await prisma.organization.findUnique({
      where: { id: Number(id) }
    });
    
    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    
    if (organization.userId !== userId) {
      res.status(403).json({ message: 'You do not have permission to delete this organization' });
      return;
    }

    await prisma.organization.delete({
      where: { id: Number(id) },
    });
    
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};