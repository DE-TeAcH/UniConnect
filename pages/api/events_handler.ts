import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/events/create';
import deleteEvent from './_logic/events/delete';
import get from './_logic/events/get';
import update from './_logic/events/update';

const handlers: any = {
    'create': create,
    'delete': deleteEvent,
    'get': get,
    'update': update
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/events/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Events API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
