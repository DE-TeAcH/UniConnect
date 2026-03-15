import { NextApiRequest, NextApiResponse } from 'next';
import checkUsername from './_logic/auth/check-username';
import login from './_logic/auth/login';
import register from './_logic/auth/register';
import resetPassword from './_logic/auth/reset-password';
import sendPin from './_logic/auth/send-pin';
import verifyPin from './_logic/auth/verify-pin';

const handlers: any = {
    'check-username': checkUsername,
    'login': login,
    'register': register,
    'reset-password': resetPassword,
    'send-pin': sendPin,
    'verify-pin': verifyPin
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/auth/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Auth API error (${action}):`, err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error', 
            error: err.message 
        });
    }
}
