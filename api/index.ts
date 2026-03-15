import { NextApiRequest, NextApiResponse } from 'next';

// EXPLICIT IMPORTS (FOR RELIABLE BUNDLING)
import auth_check_username from './_logic/auth/check-username';
import auth_login from './_logic/auth/login';
import auth_register from './_logic/auth/register';
import auth_reset_password from './_logic/auth/reset-password';
import auth_send_pin from './_logic/auth/send-pin';
import auth_verify_pin from './_logic/auth/verify-pin';

const routes: any = {
    'auth': { 
        'check-username': auth_check_username, 
        'login': auth_login, 
        'register': auth_register, 
        'reset-password': auth_reset_password, 
        'send-pin': auth_send_pin, 
        'verify-pin': auth_verify_pin 
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, action } = req.query;

    if (category === 'ping') {
        return res.status(200).json({ success: true, message: 'Master Router TS is ALIVE' });
    }

    if (!category || !action || typeof category !== 'string' || typeof action !== 'string') {
        return res.status(404).json({ success: false, message: 'Invalid API path' });
    }

    const categoryHandlers = routes[category];
    if (!categoryHandlers) {
        return res.status(404).json({ 
            success: false, 
            message: `Category ${category} is currently disabled for debugging. Only 'auth' is active.` 
        });
    }

    const actionHandler = categoryHandlers[action];
    if (!actionHandler) {
        return res.status(404).json({ success: false, message: `Action ${action} in ${category} not found` });
    }

    try {
        return await actionHandler(req, res);
    } catch (err: any) {
        console.error(`API Error (${category}/${action}):`, err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error in logic', 
            error: err.message 
        });
    }
}
