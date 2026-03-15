import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/event-categories/create';
import deleteCategory from './_logic/event-categories/delete';
import get from './_logic/event-categories/get';
import update from './_logic/event-categories/update';

const handlers: any = {
    'create': create,
    'delete': deleteCategory,
    'get': get,
    'update': update
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/event-categories/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Event Categories API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
