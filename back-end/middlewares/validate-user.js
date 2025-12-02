const USER_SECRET = 'supersecret';

export function validateUser(req, res, next) {

    const userSecret = req.headers['x-user-secret'];
    
    if (userSecret !== USER_SECRET) {
        return res.status(401).json({ error: 'Unauthorized: Invalid user secret' });
    }
    
    next();
}