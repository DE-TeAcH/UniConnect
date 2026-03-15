import { NextApiRequest, NextApiResponse } from 'next';
import get from './_logic/follows/get';
import toggle from './_logic/follows/toggle';

const handlers: any = {
    'get': get,
    'toggle': toggle
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/follows/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Follows API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
