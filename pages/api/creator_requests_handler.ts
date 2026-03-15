import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/creator-requests/create';
import deleteReq from './_logic/creator-requests/delete';
import get from './_logic/creator-requests/get';
import update from './_logic/creator-requests/update';

const handlers: any = {
    'create': create,
    'delete': deleteReq,
    'get': get,
    'update': update
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/creator-requests/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Creator Requests API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
