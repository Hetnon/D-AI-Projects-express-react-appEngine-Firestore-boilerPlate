import { getUsersCollection } from '../firebase_apis.js';
const usersCollection = getUsersCollection();

export async function getUserDocument(userEmail) {
    if (!userEmail) {
        throw new Error('User email is required');
    }
    console.log('getUserDocument userEmail', userEmail);
    try {
        const userDoc = await usersCollection.doc(userEmail).get();
        if (!userDoc.exists) {
            return null; // Return null if the user document does not exist
        }
        return userDoc.data();
    } catch (error) {
        console.error('Error in getUserDocument:', error);
        throw error;
    }
}

export async function createUser(userData) {
    if (!userData?.userEmail) {
        throw new Error('User data with userEmail is required');
    }
    try {
        const userRef = usersCollection.doc(userData.userEmail);
        await userRef.set(userData);
        return { success: true, message: 'User created successfully' };
    } catch (error) {
        console.error('Error in createUser:', error);
        throw new Error('Error creating user: ' + error.message);
    }
}


export async function getUsersList() {
    try {
        const usersSnapshot = await usersCollection.get();
        if (usersSnapshot.empty) {
            return [];
        }
        return usersSnapshot.docs.map(doc => {
            const data = doc.data();
            data.userEmail = doc.id;
            return data;
        });
    } catch (error) {
        console.error('Error in getUsersList:', error);
        throw new Error('Error fetching users list: ' + error.message);
    }
}

export async function deleteUser(userEmail) {
    if (!userEmail) {
        throw new Error('User email is required');
    }
    try {
        const userRef = usersCollection.doc(userEmail);
        await userRef.delete();
        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error in deleteUser:', error);
        throw new Error('Error deleting user: ' + error.message);
    }
}


export async function updateUserFields(userEmail, fields) {
    if (!userEmail || !fields || typeof fields !== 'object') {
        throw new Error('User email and fields object are required');
    }
    try {
        const userRef = usersCollection.doc(userEmail);
        await userRef.update(fields);
        return { success: true, message: 'User fields updated successfully' };
    } catch (error) {
        console.error('Error in updateUserFields:', error);
        throw new Error(`Error updating user fields: ${error.message}`);
    }
}
