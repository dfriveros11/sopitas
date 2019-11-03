const MongoClient = require("mongodb").MongoClient;

const MyMongoLib = function() {
  const MyMongoLib = this || {};

  // Connection URL
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  // Database Name
  const dbName = "reactive";
  // Create a new MongoClient
  const client = new MongoClient(url, { useUnifiedTopology: true });

  MyMongoLib.getDocs = () =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      client.connect((err, client) => {
        if (err !== null) {
          reject(err);
          return;
        }
        console.log("Connected correctly to server");

        const db = client.db(dbName);

        // Insert a single document
        const testCol = db.collection("inserts");

        return testCol
          .find({})
          .limit(20)
          .toArray()
          .then(resolve)
          .catch(reject);
      });
    });

  MyMongoLib.listenToChanges = cbk => {
    client.connect((err, client) => {
      if (err !== null) {
        throw err;
      }
      console.log("Connected correctly to server");

      const db = client.db(dbName);

      // Insert a single document
      const testCol = db.collection("inserts");

      const csCursor = testCol.watch();

      csCursor.on("change", data => {
        console.log("changed!", data);
        MyMongoLib.getDocs().then(docs => cbk(JSON.stringify(docs)));
      });
    });
  };

  return MyMongoLib;
};

module.exports = MyMongoLib;