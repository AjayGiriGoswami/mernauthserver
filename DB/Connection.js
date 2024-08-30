const mongoose = require("mongoose");

const db =
  "mongodb://mernauth:2580@ac-srab4gb-shard-00-00.ojcpptt.mongodb.net:27017,ac-srab4gb-shard-00-01.ojcpptt.mongodb.net:27017,ac-srab4gb-shard-00-02.ojcpptt.mongodb.net:27017/Mernauth?ssl=true&replicaSet=atlas-repp1a-shard-0&authSource=admin&retryWrites=true&w=majority&appName=MernAuth";

mongoose
  .connect(db)

  .then(() => {
    console.log("DataBase Connection start");
  })
  .catch((error) => {
    console.log(error);
  });
