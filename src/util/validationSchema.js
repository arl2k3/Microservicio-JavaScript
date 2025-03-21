const { z, OK } = require('zod');

const userSchema = z.object({
    user    : z.string().min(5).max(15),
    email: z.string().email(),
    recovery_email: z.string().email().optional(),
    password: z.string().min(6).max(20),
    verified: z.boolean().default(false), 
    verificationCode: z.string().default("").optional(),
    isAdmin: z.boolean().default(false),
});

const registerUserSchema = z.object({
    user    : z.string().min(5).max(15),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    recovery_email: z.string().email().optional(),
});


const verifyAccSchema = z.object({
    email: z.string().email(),
    verificationCode: z.string().length(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
});

module.exports = { userSchema, registerUserSchema, verifyAccSchema, loginSchema };
