//Import the mongoose module
const mongoose = require("mongoose");

class Database {
  connection = mongoose.connection;

  constructor() {
    try {
      this.connection
        .on("open", console.info.bind(console, "Database connection: open"))
        .on("close", console.info.bind(console, "Database connection: close"))
        .on(
          "disconnected",
          console.info.bind(console, "Database connection: disconnected")
        )
        .on("error", console.error.bind(console, "MongoDB connection: error:"));
    } catch (error) {
      console.error(error);
    }
  }

  async connect() {
    try {
      await mongoose.connect(
        `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}`
      );
    } catch (error) {
      console.error(error);
    }
  }

  async close() {
    try {
      await this.connection.close();
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Database();
