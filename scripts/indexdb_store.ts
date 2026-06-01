import * as util from "./util.js";

/** A single stored record. `_key` is the fixed primary key; all other keys are user data. */
interface StoredRecord {
  _key: number;
  [key: string]: unknown;
}

export class IndexDBStore {
  dbname: string;
  /**
   * In-flight connection/setup promise. The constructor seeds it with the
   * initial open/setup (resolving to void); `_connect` replaces it with a
   * promise resolving to the open database. Cleared to undefined once settled.
   */
  promise: Promise<void | IDBDatabase> | undefined;

  constructor(dbname: string) {
    this.dbname = dbname;

    this.promise = new Promise<void>((accept, reject) => {
      //check for support
      if (!("indexedDB" in window)) {
        throw new Error("This browser doesn't support IndexedDB");
      }

      let res = indexedDB.open(this.dbname, 5);

      res.onupgradeneeded = (event) => {
        let upgradeDb = res.result;

        upgradeDb.onerror = (event) => {
          console.warn("IndexedDBError", event);
          reject();
        };

        if (!upgradeDb.objectStoreNames.contains(this.dbname)) {
          console.log("creating idb database. . .");

          let store = upgradeDb.createObjectStore(this.dbname, {
            keyPath: "_key",
          });

          store.createIndex("index", "data", {});
        }
      };

      res.onsuccess = (event) => {
        let db = res.result;

        let tx = db.transaction(this.dbname, "readwrite");
        let store = tx.objectStore(this.dbname);

        let countReq = store.count();
        countReq.onsuccess = (event) => {
          if (countReq.result === 0) {
            store.add({ _key: 0 });
          }
        };

        tx.oncomplete = (event) => {
          this.promise = undefined;
          accept();
        };

        tx.onerror = () => {
          this.promise = undefined;
          reject();
        };
      };
    });
  }

  _connect(): Promise<IDBDatabase> {
    let promise = this.promise;

    let connectPromise = new Promise<IDBDatabase>((accept, reject) => {
      let connect = () => {
        let res = indexedDB.open(this.dbname, 5);
        res.onsuccess = (event) => {
          let db = res.result;

          accept(db);
        };

        res.onerror = (event) => {
          this.promise = undefined;
          reject(res.error);
        };
      };

      if (promise !== undefined) {
        promise.then(connect);
      } else {
        connect();
      }
    });

    this.promise = connectPromise;

    connectPromise.then((db) => {
      this.promise = undefined;
    });

    return connectPromise;
  }

  write(key: string, val: unknown): Promise<void> {
    return new Promise<void>((accept, reject) => {
      this._connect().then((db) => {
        let tx = db.transaction(this.dbname, "readwrite");
        let store = tx.objectStore(this.dbname);

        let req = store.getAll();

        req.onsuccess = (event) => {
          let rows = req.result as StoredRecord[];
          let data: StoredRecord;
          if (rows.length === 0) {
            data = { _key: 0 };
          } else {
            data = rows[0];
          }

          data[key] = val;
          store.put(data);
        };
      });
    });
  }

  clear(): Promise<void> {
    return new Promise<void>((accept, reject) => {
      this._connect()
        .then((db) => {
          let tx = db.transaction(this.dbname, "readwrite");
          let store = tx.objectStore(this.dbname);

          store.clear();
        })
        .catch(reject);
    });
  }

  keys(): Promise<string[]> {
    return new Promise<string[]>((accept, reject) => {
      this._connect().then((db) => {
        let tx = db.transaction(this.dbname, "readwrite");
        let store = tx.objectStore(this.dbname);

        let req = store.getAll();

        req.onsuccess = (event) => {
          let rows = req.result as StoredRecord[];
          let data: StoredRecord;
          if (rows.length === 0) {
            data = { _key: 0 };
          } else {
            data = rows[0];
          }

          let keys: string[] = [];
          for (let k of Object.keys(data)) {
            if (k !== "_key") {
              keys.push(k);
            }
          }

          accept(keys);
        };
      });
    });
  }

  read(key: string, val?: unknown): Promise<unknown> {
    return new Promise<unknown>((accept, reject) => {
      this._connect().then((db) => {
        let tx = db.transaction(this.dbname, "readwrite");
        let store = tx.objectStore(this.dbname);

        let req = store.getAll();

        req.onsuccess = (event) => {
          let rows = req.result as StoredRecord[];
          let data: StoredRecord;
          if (rows.length === 0) {
            data = { _key: 0 };
          } else {
            data = rows[0];
          }

          accept(data[key]);
        };
      });
    });
  }
}

let test_idgen = 0;

export function test(): void {
  let store = new IndexDBStore("test");
  store.write("bleh", [test_idgen++, 1, 2, 3]);

  store.read("bleh").then((val) => {
    console.log(val);
  });

  store.keys().then((keys) => {
    console.log(keys);
  });
}

export function readTest(): void {
  let store = new IndexDBStore("test");

  store.keys().then((keys) => {
    console.log(keys);
  });
}
