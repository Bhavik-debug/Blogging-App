const { validateToken } = require("../service/authentication");
const User = require("../models/user");

function checkForAuthenticationCookie(cookieName) {
    return async (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            req.user = null;
            return next();
        }
        try {
            const payload = validateToken(tokenCookieValue);
            // Fetch full user from DB
            const user = await User.findById(payload._id);
            req.user = user;            
            res.locals.user = user; 
        } 
        catch (error) {
            console.error("Invalid token:", error.message);
            req.user = null; 
        }     
        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
}
