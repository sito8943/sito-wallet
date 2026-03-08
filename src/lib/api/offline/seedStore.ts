const createObjectStoreIfMissing = (
  db: IDBDatabase,
  storeName: string,
): void => {
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, {
      keyPath: "id",
      autoIncrement: true,
    });
  }
};

const openDatabase = (
  dbName: string,
  version?: number,
  onUpgradeNeeded?: (db: IDBDatabase) => void,
): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request =
      typeof version === "number"
        ? indexedDB.open(dbName, version)
        : indexedDB.open(dbName);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      onUpgradeNeeded?.(db);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      reject(new Error("IndexedDB upgrade blocked"));
    };
  });

const openDatabaseWithStore = async (
  dbName: string,
  storeName: string,
): Promise<IDBDatabase> => {
  try {
    const initialDb = await openDatabase(dbName, 1, (upgradeDb) => {
      createObjectStoreIfMissing(upgradeDb, storeName);
    });

    if (initialDb.objectStoreNames.contains(storeName)) {
      return initialDb;
    }

    initialDb.close();
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== "VersionError") {
      throw error;
    }
  }

  let db = await openDatabase(dbName);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (db.objectStoreNames.contains(storeName)) {
      return db;
    }

    const nextVersion = db.version + 1;
    db.close();

    db = await openDatabase(dbName, nextVersion, (upgradeDb) => {
      createObjectStoreIfMissing(upgradeDb, storeName);
    });
  }

  db.close();
  throw new Error(`IndexedDB store "${storeName}" was not created`);
};

export const seedStore = async <T>(
  dbName: string,
  storeName: string,
  items: T[],
): Promise<void> => {
  const db = await openDatabaseWithStore(dbName, storeName);

  try {
    await new Promise<void>((resolve, reject) => {
      let tx: IDBTransaction;

      try {
        tx = db.transaction(storeName, "readwrite");
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Failed to open IndexedDB transaction"),
        );
        return;
      }

      const store = tx.objectStore(storeName);
      items.forEach((item) => {
        store.put(item);
      });

      tx.oncomplete = () => {
        resolve();
      };

      tx.onerror = () => {
        reject(tx.error ?? new Error("IndexedDB transaction failed"));
      };

      tx.onabort = () => {
        reject(tx.error ?? new Error("IndexedDB transaction aborted"));
      };
    });
  } finally {
    db.close();
  }
};
