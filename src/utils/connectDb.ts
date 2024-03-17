import mongoose from "mongoose";

mongoose.connect("mongodb+srv://adeoluwaagbakosi:O3v0isOyK1wd7fTy@cluster0.5yl3g98.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to database");
});

export default db;