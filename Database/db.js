const mongoose = require("mongoose");
const db = process.env.MONGO_SERVER;

const mongooseConnect = async () => {
  try {
    //strictQuery, will check Schema for property before running
    // this is more efficient
    mongoose.set("strictQuery", true);
    await mongoose.connect(db);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log("MongoDB is connected...");
};

module.exports = { mongooseConnect };
