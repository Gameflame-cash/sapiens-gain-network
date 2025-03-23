
/**
 * Database service for handling IndexedDB storage operations
 */

// Define database configuration
const DB_NAME = "sapiensDB";
const DB_VERSION = 1;
const STORES = {
  TRANSACTIONS: "transactions",
  USERS: "users"
};

// Initialize the database
const initializeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject("Error opening database");
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        const transactionStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: "id" });
        transactionStore.createIndex("userId", "userId", { unique: false });
        transactionStore.createIndex("status", "status", { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        const userStore = db.createObjectStore(STORES.USERS, { keyPath: "id" });
        userStore.createIndex("username", "username", { unique: true });
      }
    };
  });
};

// Generic function to get all items from a store
const getAllItems = async (storeName: string): Promise<any[]> => {
  const db = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error(`Error getting items from ${storeName}:`, event);
      reject(`Error getting items from ${storeName}`);
    };
  });
};

// Generic function to add an item to a store
const addItem = async (storeName: string, item: any): Promise<any> => {
  const db = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    
    request.onsuccess = () => {
      resolve(item);
    };
    
    request.onerror = (event) => {
      console.error(`Error adding item to ${storeName}:`, event);
      reject(`Error adding item to ${storeName}`);
    };
  });
};

// Generic function to update an item in a store
const updateItem = async (storeName: string, item: any): Promise<any> => {
  const db = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onsuccess = () => {
      resolve(item);
    };
    
    request.onerror = (event) => {
      console.error(`Error updating item in ${storeName}:`, event);
      reject(`Error updating item in ${storeName}`);
    };
  });
};

// Database service API
const DatabaseService = {
  // Transaction specific methods
  getTransactions: async () => {
    try {
      const transactions = await getAllItems(STORES.TRANSACTIONS);
      return transactions;
    } catch (error) {
      console.error("Error getting transactions:", error);
      
      // Fallback to localStorage if IndexedDB fails
      try {
        return JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
      } catch {
        return [];
      }
    }
  },
  
  addTransaction: async (transaction: any) => {
    try {
      await addItem(STORES.TRANSACTIONS, transaction);
      
      // Also update localStorage for backward compatibility
      const transactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
      transactions.push(transaction);
      localStorage.setItem('sapiens_transactions', JSON.stringify(transactions));
      
      return transaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },
  
  updateTransaction: async (transaction: any) => {
    try {
      await updateItem(STORES.TRANSACTIONS, transaction);
      
      // Also update localStorage for backward compatibility
      const transactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
      const index = transactions.findIndex((t: any) => t.id === transaction.id);
      if (index !== -1) {
        transactions[index] = transaction;
        localStorage.setItem('sapiens_transactions', JSON.stringify(transactions));
      }
      
      return transaction;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },
  
  // User specific methods
  getUsers: async () => {
    try {
      const users = await getAllItems(STORES.USERS);
      return users;
    } catch (error) {
      console.error("Error getting users:", error);
      
      // Fallback to localStorage if IndexedDB fails
      try {
        return JSON.parse(localStorage.getItem('sapiens_users') || '[]');
      } catch {
        return [];
      }
    }
  },
  
  addUser: async (user: any) => {
    try {
      await addItem(STORES.USERS, user);
      
      // Also update localStorage for backward compatibility
      const users = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
      users.push(user);
      localStorage.setItem('sapiens_users', JSON.stringify(users));
      
      return user;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  },
  
  updateUser: async (user: any) => {
    try {
      await updateItem(STORES.USERS, user);
      
      // Also update localStorage for backward compatibility
      const users = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
      const index = users.findIndex((u: any) => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem('sapiens_users', JSON.stringify(users));
      }
      
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  
  // Initialize the database from localStorage (migration)
  initFromLocalStorage: async () => {
    try {
      // Migrate transactions
      const transactions = JSON.parse(localStorage.getItem('sapiens_transactions') || '[]');
      if (transactions.length > 0) {
        for (const transaction of transactions) {
          try {
            await addItem(STORES.TRANSACTIONS, transaction);
          } catch (e) {
            console.log("Transaction already exists in IndexedDB, skipping:", transaction.id);
          }
        }
      }
      
      // Migrate users
      const users = JSON.parse(localStorage.getItem('sapiens_users') || '[]');
      if (users.length > 0) {
        for (const user of users) {
          try {
            await addItem(STORES.USERS, user);
          } catch (e) {
            console.log("User already exists in IndexedDB, skipping:", user.id);
          }
        }
      }
      
      console.log("Migration from localStorage to IndexedDB completed");
      return true;
    } catch (error) {
      console.error("Migration error:", error);
      return false;
    }
  }
};

export default DatabaseService;
