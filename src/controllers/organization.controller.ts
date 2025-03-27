import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { organizationSchema } from '../utils/validationSchemas';

const prisma = new PrismaClient();

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
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
    
    const organization = await prisma.organization.findUnique({
      where: { id: Number(id) },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
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
        }
      }
    });

    if (existingOrg) {
      res.status(400).json({ message: 'Organization name must be unique' });
      return;
    }
    
    const organization = await prisma.organization.create({
      data: validatedData,
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
    const validatedData = organizationSchema.parse(req.body);

    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: 'insensitive'
        },
        id: {
          not: Number(id)
        }
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