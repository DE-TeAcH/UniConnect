import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/supervisor-guests/create';
import deleteGuest from './_logic/supervisor-guests/delete';
import get from './_logic/supervisor-guests/get';

const handlers: any = {
    'create': create,
    'delete': deleteGuest,
    'get': get
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/supervisor-guests/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Supervisor Guests API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
