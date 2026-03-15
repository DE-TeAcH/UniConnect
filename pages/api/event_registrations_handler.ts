import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/event-registrations/create';
import deleteReg from './_logic/event-registrations/delete';
import get from './_logic/event-registrations/get';

const handlers: any = {
    'create': create,
    'delete': deleteReg,
    'get': get
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/event-registrations/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Event Registrations API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
