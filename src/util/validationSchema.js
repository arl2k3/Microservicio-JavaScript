const { z } = require('zod');

const userSchema = z.object({
    user    : z.string().min(5).max(15),
    email: z.string().email(),
    recovery_email: z.string().email().optional(),
    password: z.string().min(6).max(20),
    verified: z.boolean().default(false), 
    verificationCode: z.string().default("").optional(),
    isAdmin: z.boolean().default(false),
});

module.exports = { userSchema };