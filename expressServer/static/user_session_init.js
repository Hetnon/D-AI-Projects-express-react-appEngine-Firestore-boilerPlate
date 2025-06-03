

export async function terminateSession(req, res, io) {
    console.log('terminateSessprojectNamen called');
    if (!req.session.user) {
        console.log("No user found in session during log out request");
        return res.status(400).send('No user found in session during log out request'); // Added return here
    }
    const user = req.session.user;
    const userEmail = user.userEmail;
    const sessionId = req.session.id;
    
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.status(500).send('Error during logout'); // Added return here
            }

            const socket = io ? Array.from(io.sockets.sockets.values()).find(s => s.sessionId === sessionId) : null
            if (socket) {
                socket.disconnect(true);  // Force disconnect
            }
            const cookieName = (process.env.NODE_ENV === 'production') ? 'quoteMaster-session' : 'quoteMaster-devSession';
            res.cookie(cookieName, '', {
                expires: new Date(0), // Set to a past date
                path: '/',
                httpOnly: true,
                secure: true, // make sure to match the secure flag as originally set
                sameSite: 'Strict'
            });
            console.log("User logged out: ", userEmail);
            return res.sendStatus(200); // Added return here
        });
    } catch (error) {
        console.error('Firestore express session update error:', error);
        return res.status(500).send('Error updating user data'); // Added return here
    }
};