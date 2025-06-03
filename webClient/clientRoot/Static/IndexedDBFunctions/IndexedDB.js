export async function initializeIndexedDB(initializeApp){
    console.log('initializing IndexedDB', initializeApp ? `with function: ${initializeApp?.name}` : '');
    if (!window.indexedDB) {
        console.log("Your browser doesn't support IndexedDB.");
        return;
    }
    const dbName = "indexedDatabase";
    const dbVersion = 1; // Update this as necessary based on your versioning strategy

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
        console.error("Database error: ", event.target.error);
    };

    request.onsuccess = function() {
        console.log('Database opened successfully');
        if (initializeApp !== null) {
            initializeApp();  
        }
        // Do not close the db here if you need to perform operations immediately after
    };

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        createObjectStores(db); // Call a function to create your object stores
    };

    function createObjectStores(db) {
        // Your logic to create object stores
        console.log('creating object stores');
        if (!db.objectStoreNames.contains("somethingList")) {
            db.createObjectStore("somethingList", { keyPath: "id" });
            console.log('created somethingList object store');
        }
        if(!db.objectStoreNames.contains("currentSomthing")) {
            db.createObjectStore("currentSomthing", { keyPath: "id" });
            console.log('created currentSomthing object store');
        }
    }
}


    export function openDatabase(storeName) {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error("IndexedDB is not supported by this browser."));
            }
            const request = indexedDB.open("indexedDatabase", 1);
            request.onerror = event => reject(new Error(`Open database error for : ${storeName}, ${event.target.errorCode}`));
            request.onsuccess = event => resolve(event.target.result);
            request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "id" });
            };
        });
    }
  

    export async function saveDataIndexedDB(data, storeName, id, callingFrom) {
        try {
            const db = await openDatabase('indexedDatabase');
            const transaction = db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            switch(storeName) {
                case "somethingList":
                    if(Array.isArray(data)){ // the info is coming from the database with all the somethingList at the same time
                        data.forEach(something => {
                            store.put({ id: something.somethingId, value: something });
                        });
                        transaction.oncomplete = () => db.close();
                        transaction.onerror = event => {
                            db.close();
                            console.error("Error in saving data to somethingList: ", event.target.errorCode);
                        };
                    } else {  // we are creating or updating a single service order
                        const putRequest = store.put({ id, value: data });
                        putRequest.onsuccess = () => db.close();
                        putRequest.onerror = event => {
                            db.close();
                            console.error("Error in saving data to somethingList: ", event.target.errorCode);
                        };
                    }
                    break;
                case 'currentSomthing':{
                    const putRequest = store.put({ id, value: data });
                    putRequest.onsuccess = () => db.close();
                    putRequest.onerror = event => {
                        db.close();
                        console.error("Error in saving data to currentSomthing: ", event.target.errorCode);
                    };
                    break;
                }
                default:
                    if(db) {db.close();}
                    console.error('saveDataIndexedDB got in default', storeName, id, data);
                    break;
            }
        } catch (error) {
            console.error("Error on Saving data for:", storeName, callingFrom, id, error);
        }
    }

    export async function loadDataIndexedDB(storeName) { 
        try {
            const db = await openDatabase();
            console.log('loading from IndexedDB', storeName)
            const transaction = db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            return new Promise((resolve, reject) => {
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (!result) {
                        resolve(null);
                        db.close();
                        return;
                    }
                    if(storeName === "somethingList") {
                        resolve(result.map(item => item.value));
                    }
                    if(storeName === "currentSomthing") {
                        resolve(result[0] ? result[0].value : null);
                    }
                    db.close();
                    
                }
                request.onerror = event => {
                    reject(new Error(event.target.errorCode)); 
                    db.close();
                } 
            });
        } catch (error) {
            console.error("Database opening error: ", storeName, error);
            return Promise.reject(new Error(error));
        }
    }

    export function clearIndexedDB(dbName) {
        const request = indexedDB.open(dbName, 1);// Open a connection to the database
        request.onerror = function(event) {
            console.error("Database error: ", event.target.errorCode);
        };
        request.onsuccess = function(event) {
            const db = event.target.result;
            // Clear all object stores
            if(db.objectStoreNames.length === 0) return;
            const transaction = db.transaction(db.objectStoreNames, 'readwrite');
            transaction.oncomplete = function() {
                db.close(); // Close the database connection
                deleteIndexedDB(dbName); // Delete the database
            };
            transaction.onerror = function(event) {
            console.error("Transaction error: ", event.target.errorCode);
            };
            Array.from(db.objectStoreNames).forEach(storeName => {
                const store = transaction.objectStore(storeName);
                const clearRequest = store.clear();
                clearRequest.onerror = function(event) {
                    console.error(`Error clearing object store ${storeName}: `, event.target.errorCode);
                };
            });
        };
    }

    export async function deleteDataIndexedDB(storeName, id) {
        try {
            const db = await openDatabase(storeName);
            const transaction = db.transaction([storeName], "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            request.onsuccess = () => db.close(); 
            request.onerror = event => {db.close(); console.error("Error in deleting data: ", event.target.errorCode);}
        } catch (error) {
            console.error("Database opening error: ", error);
        }
    }

    export function deleteIndexedDB(dbName) {

        const request = indexedDB.deleteDatabase(dbName);
        request.onerror = function(event) {
            console.error("Database deletion error: ", event.target.errorCode);
        };
        request.onsuccess = function(event) { 
            console.log("Database deleted successfully.");
        };
        request.onblocked = function(event) {// This event is triggered if the database is still open somewhere else.
            console.log("Database deletion is blocked because it is open somewhere else.");
        };
    }
