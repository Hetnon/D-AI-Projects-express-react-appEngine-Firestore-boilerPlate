const databases = ['firestore'];

let  methodsByDb = {};
let getUserDocument, createUserDB, getUsersListDB, deleteUserDB, updateUserFields;
let initialized = false;
export default async function loadDatabaseMethods() {
    const results = await Promise.all(
        databases.map(db =>
            import(`../${db}/methods.js`)
                .then(module => ({ name: db, methods: Object.values(module)[0] }))
                .catch(err => {
                    console.error(`Failed to load ${db}:`, err);
                    return null;
                })
        )
    );


    for (const res of results) {
        if (res) {
            methodsByDb[res.name] = res.methods;
        }
    }

    getUserDocument = methodsByDb['firestore']['getUserDocument'];
    createUserDB = methodsByDb['firestore']['createUser'];
    getUsersListDB = methodsByDb['firestore']['getUsersList'];
    deleteUserDB = methodsByDb['firestore']['deleteUser'];
    updateUserFields = methodsByDb['firestore']['updateUserFields'];
    initialized = true;

}

export function getMethods() {
    if (!initialized) {
        throw new Error('Database methods not loaded yet. Call loadDatabaseMethods() first.');
    }

    return {
        getUserDocument,
        createUserDB,
        getUsersListDB,
        deleteUserDB,
        updateUserFields
    };
}
