export function validateUser(callingFunctionName) {
    return function(req, res, next) {
        const user = req.session?.user;

        if (!user) {
            console.log('No user found in session when calling: ', callingFunctionName);
            res.status(401).json({ error: 'NoUserInSession', message: 'No user found in session' });
            return;
        } 

        const adminFunctions = [
            'getUsersList', 
            'createUser', 
            'changeUserStatus', 
            'deleteUser', 
            'getProvidersList', 
            'createProvider', 
            'updateProvider', 
            'deleteProvider', 
            'getProvidersReport', 
        ];
       
        if (adminFunctions.includes(callingFunctionName) && user && user.userType==='agent') {
            console.log('Agent user trying to access function restricted to admin: ', callingFunctionName);
            res.status(401).json({ error: 'AgentUserBlockedAccess', message: `Agent trying to access restricted function ${callingFunctionName}`});
            return;
            
        }
        next();

    }
}

export function checkUserSession(req, res) {

    const user = req.session?.user;

    if (!user) {
        console.log('No user found in session');
        res.status(401).json({ error: 'NoUserInSession', message: 'No user found in session' });
        return;
    }

    const responseUser = {
        userEmail: user.userEmail,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic
    };
    
    res.status(200).json({ responseUser });
}