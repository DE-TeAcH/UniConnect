import { NextApiRequest, NextApiResponse } from 'next';
import create from './_logic/teams/create';
import deleteTeam from './_logic/teams/delete';
import get from './_logic/teams/get';
import update from './_logic/teams/update';

const handlers: any = {
    'create': create,
    'delete': deleteTeam,
    'get': get,
    'update': update
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string' || !handlers[action]) {
        return res.status(404).json({ success: false, message: `Endpoint /api/teams/${action} not found` });
    }

    try {
        return await handlers[action](req, res);
    } catch (err: any) {
        console.error(`Teams API error (${action}):`, err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}
