import mongoose from "mongoose";
const { Schema } = mongoose;
const PlayQueueSchema = new Schema({}, { strict: false });

module.exports = mongoose.model("playQueue", PlayQueueSchema, "playQueue");
