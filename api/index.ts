import { NextApiRequest, NextApiResponse } from 'next';

// TEMPORARILY DISABLED REGULAR IMPORTS FOR DEBUGGING
// If any of these imports fail, the whole function crashes at boot.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, action } = req.query;

    if (category === 'ping') {
        return res.status(200).json({ 
            success: true, 
            message: 'Master Router TS (Minimal) is ALIVE',
            debug: 'If you see this, the TS compiler and base Next types are working.' 
        });
    }

    return res.status(404).json({ 
        success: false, 
        message: 'Logic loading is currently disabled for isolation testing.',
        category,
        action
    });
}
