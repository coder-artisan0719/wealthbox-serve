import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { integrationConfigSchema } from '../utils/validationSchemas';
import { fetchWealthboxUsers } from '../services/wealthbox.service';

const prisma = new PrismaClient();

export const saveIntegrationConfig:RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const validatedData = integrationConfigSchema.parse(req.body);
    
    const existingConfig = await prisma.integrationConfig.findFirst({
      where: {
        userId: req.user.id,
        integrationType: validatedData.integrationType,
      },
    });
    
    let integrationConfig;
    
    if (existingConfig) {
      integrationConfig = await prisma.integrationConfig.update({
        where: { id: existingConfig.id },
        data: {
          apiToken: validatedData.apiToken,
        },
      });
    } else {
      integrationConfig = await prisma.integrationConfig.create({
        data: {
          userId: req.user.id,
          integrationType: validatedData.integrationType,
          apiToken: validatedData.apiToken,
        },
      });
    }
    
    res.status(200).json({
      message: 'Integration configuration saved successfully',
      integrationConfig: {
        id: integrationConfig.id,
        integrationType: integrationConfig.integrationType,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getIntegrationConfig:RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { integrationType } = req.params;
    
    const integrationConfig = await prisma.integrationConfig.findFirst({
      where: {
        userId: req.user.id,
        integrationType,
      },
    });
    
    if (!integrationConfig) {
      res.status(404).json({ message: 'Integration configuration not found' });
      return;
    }
    
    res.status(200).json({
      id: integrationConfig.id,
      integrationType: integrationConfig.integrationType,
      apiToken: integrationConfig.apiToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const syncWealthboxUsers:RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const integrationConfig = await prisma.integrationConfig.findFirst({
      where: {
        userId: req.user.id,
        integrationType: 'wealthbox',
      },
    });
    
    if (!integrationConfig) {
      res.status(404).json({ message: 'Wealthbox integration not configured' });
      return;
    }
    
    const wealthboxUsers = await fetchWealthboxUsers(integrationConfig.apiToken);
    
    const createdUsers = [];
    const skippedUsers = [];
    
    for (const user of wealthboxUsers) {
      const existingUser = await prisma.wealthboxUser.findFirst({
        where: {
          email: user.email,
        }
      });
      
      if (existingUser) {
        skippedUsers.push(user.email);
        continue;
      }
      
      const createdUser = await prisma.wealthboxUser.create({
        data: {
          wealthboxId: user.id.toString(),
          email: user.email,
          name: user.name,
          account: user.account || null,
          excludedFromAssignments: user.excluded_from_assignments || false,
          organizationId: req.user.organizationId
        }
      });
      
      createdUsers.push(createdUser);
    }
    
    res.status(200).json({
      message: 'Wealthbox users synced successfully',
      count: createdUsers.length,
      skipped: skippedUsers.length,
      skippedEmails: skippedUsers
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getWealthboxUsers:RequestHandler = async (req: Request, res: Response):Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    const { organizationId } = req.query;
    
    const whereClause: any = {};
    
    if (organizationId && organizationId !== 'all') {
      whereClause.organizationId = Number(organizationId);
    }
    
    const wealthboxUsers = await prisma.wealthboxUser.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc'
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    res.status(200).json(wealthboxUsers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};