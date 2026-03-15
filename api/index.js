// Master Router with Diagnostic Loading
export default async function handler(req, res) {
    const { category, action } = req.query;

    if (category === 'ping') {
        return res.status(200).json({ success: true, message: 'Master Router JS is ALIVE' });
    }

    // Try to load AUTH locally to see if it causes the crash
    if (category === 'auth') {
        try {
            // Internal Diagnostic: Check if we can even resolve the files
            const loginPath = './_logic/auth/login.ts';
            
            try {
                const module = await import(loginPath);
                return await module.default(req, res);
            } catch (innerErr) {
                console.error('Logic Loading Error:', innerErr);
                return res.status(500).json({ 
                    success: false, 
                    message: `Failed to load ${category}/${action} logic`, 
                    error: innerErr.message,
                    stack: innerErr.stack,
                    hint: 'This means the crash is inside the logic file or its imports (db, bcrypt, etc.)'
                });
            }
        } catch (outerErr) {
            return res.status(500).json({ success: false, message: 'Outer selector error', error: outerErr.message });
        }
    }

    return res.status(404).json({ success: false, message: `Category ${category} logic is currently disabled for isolation` });
}
