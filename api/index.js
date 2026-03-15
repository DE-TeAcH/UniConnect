// Ultimate Master Router (JS Version)
// This version is designed to be extremely stable by only loading code when needed.

export default async function handler(req, res) {
    const { category, action } = req.query;

    // 1. Simple Ping Check (No imports)
    if (category === 'ping') {
        return res.status(200).json({ success: true, message: 'Master Router is connected and stable' });
    }

    if (!category || !action) {
        return res.status(404).json({ success: false, message: 'Missing category or action' });
    }

    try {
        let actionHandler;
        
        // Dynamic import based on category and action
        // This ensures Vercel only loads the specific code path being called
        try {
            const module = await import(`./_logic/${category}/${action}.ts`);
            actionHandler = module.default;
        } catch (importErr) {
            // Try without .ts extension if needed by the runner
            const module = await import(`./_logic/${category}/${action}`);
            actionHandler = module.default;
        }

        if (typeof actionHandler !== 'function') {
            return res.status(404).json({ success: false, message: `Handler not found for ${category}/${action}` });
        }

        return await actionHandler(req, res);
    } catch (err) {
        console.error(`API Runtime Error at ${category}/${action}:`, err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: err.message,
            path: `${category}/${action}`
        });
    }
}
