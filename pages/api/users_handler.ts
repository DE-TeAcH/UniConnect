import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/users/create';
import deleteUser from './_logic/users/delete';
import get from './_logic/users/get';
import update from './_logic/users/update';

const handlers: any = {
    'create': create,
    'delete': deleteUser,
    'get': get,
    'update': update
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/users/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Users API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
