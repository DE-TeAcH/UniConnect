import { NextApiRequest, NextApiResponse } from 'next';
import get from './_logic/favorites/get';
import toggle from './_logic/favorites/toggle';

const handlers: any = {
    'get': get,
    'toggle': toggle
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/favorites/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Favorites API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
