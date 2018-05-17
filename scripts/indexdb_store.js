var _indexdb_store = undefined;

define([
  "util"
], function(util) {
  "use strict";
  
  let exports = _indexdb_store = {};
  
  let IndexDBStore = exports.IndexDBStore = class IndexDBStore {
    constructor(dbname) {
      this.dbname = dbname;

      this.promise = new Promise((accept, reject) => {
        //check for support
        if (!('indexedDB' in window)) {
          throw new Error('This browser doesn\'t support IndexedDB');
        }

        let res = indexedDB.open(this.dbname, 5);

        res.onupgradeneeded = (event) => {
          let upgradeDb = event.target.result;

          upgradeDb.onerror = (event) => {
            console.warn("IndexedDBError", event);
            reject();
          }
          
          if (!upgradeDb.objectStoreNames.contains(this.dbname)) {
            console.log("creating idb database. . .");

            let store = upgradeDb.createObjectStore(this.dbname,  {keyPath : "_key"});

            store.createIndex('index', 'data', {});
          }
        }

        res.onsuccess = (event) => {
          let db = event.target.result;

          let tx = db.transaction(this.dbname, 'readwrite');
          let store = tx.objectStore(this.dbname);
          
          store.count().onsuccess = (event) => {
            if (event.target.result == 0) {
              store.add({_key : 0});
            }           
          }

          tx.oncomplete = (event) => {
            this.promise = undefined;
            accept();
          }

          tx.onerror = () => {
            this.promise = undefined;
            reject();
          }
        };
      });
    }
    
    _connect() {
      let promise = this.promise;

      this.promise = new Promise((accept, reject) => {
        let connect = () => {
          let res = indexedDB.open(this.dbname, 5);
          res.onsuccess = (event) => {
            let db = event.target.result;
            
            accept(db);
          }

          res.onerror = (event) => {
            this.promise = undefined;
            reject(event.target.error);
          }
        }

        if (promise !== undefined) {
          promise.then(connect);
        } else {
          connect();
        }
      });

      this.promise.then((db) => {
        this.promise = undefined;
      });

      return this.promise;
    }
    
    write(key, val) {
      return new Promise((accept, reject) => {
        this._connect().then((db) => {
          let tx = db.transaction(this.dbname, 'readwrite');
          let store = tx.objectStore(this.dbname);

          let req = store.getAll();

          req.onsuccess = (event) => {
            let data = event.target.result;
            if (data.length == 0) {
              data = {_key : 0};
            } else {
              data = data[0];
            }

            data[key] = val;
            store.put(data);
          }
        });
      });
    }
    
    keys() {
      return new Promise((accept, reject) => {
        this._connect().then((db) => {
          let tx = db.transaction(this.dbname, 'readwrite');
          let store = tx.objectStore(this.dbname);

          let req = store.getAll();

          req.onsuccess = (event) => {
            let data = event.target.result;
            if (data.length == 0) {
              data = {_key : 0};
            } else {
              data = data[0];
            }

            let keys = [];
            for (let k of Object.keys(data)) {
              if (k !== "_key") {
                keys.push(k);
              }
            }

            accept(keys);
          }
        });
      });
    }
    
    read(key, val) {
      return new Promise((accept, reject) => {
        this._connect().then((db) => {
          let tx = db.transaction(this.dbname, 'readwrite');
          let store = tx.objectStore(this.dbname);

          let req = store.getAll();

          req.onsuccess = (event) => {
            let data = event.target.result;
            if (data.length == 0) {
              data = {_key : 0};
            } else {
              data = data[0];
            }

            accept(data[key]);
          }
        });
      });
    }
  }
  
  let test_idgen = 0;

  exports.test = function() {
    let store = new IndexDBStore('test');
    store.write("bleh", [test_idgen++, 1, 2, 3]);

    store.read("bleh").then((val) => {
      console.log(val);
    });

    store.keys().then((keys) => {
      console.log(keys);
    });
  }
  
  exports.readTest = function() {
    let store = new IndexDBStore('test');
    
    store.keys().then((keys) => {
      console.log(keys);
    });
  }

  return exports;
});

