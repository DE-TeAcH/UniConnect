import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { action } = req.query;
    if (!action || typeof action !== 'string') {
        return res.status(400).json({ success: false, message: 'Action is required' });
    }

    try {
        const { default: actionHandler } = await import(`./_logic/supervisor-guests/${action}`);
        return await actionHandler(req, res);
    } catch (err) {
        return res.status(404).json({ success: false, message: 'Endpoint not found' });
    }
}
