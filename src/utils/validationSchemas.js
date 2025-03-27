"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationConfigSchema = exports.organizationSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2),
    organizationId: zod_1.z.number().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.organizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Organization name is required').max(50, 'Organization name cannot exceed 50 characters'),
    description: zod_1.z.string().optional(),
});
exports.integrationConfigSchema = zod_1.z.object({
    integrationType: zod_1.z.string(),
    apiToken: zod_1.z.string().min(1),
});
