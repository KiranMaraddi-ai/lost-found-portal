const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔥 CONNECT MONGODB (FOR DEPLOYMENT)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 📦 SCHEMA
const itemSchema = new mongoose.Schema({
  name: String,
  location: String,
  type: String,
  time: String,
  image: String,
});

const Item = mongoose.model("Item", itemSchema);

// 📸 MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📥 GET ITEMS
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// 📤 ADD ITEM (WITH IMAGE)
app.post("/items", upload.single("image"), async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    location: req.body.location,
    type: req.body.type,
    time: req.body.time,
    image: req.file ? req.file.filename : "",
  });

  await newItem.save();
  res.json(newItem);
});

// ❌ DELETE ITEM
app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✏️ UPDATE ITEM
app.put("/items/:id", async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

// 🚀 START SERVER (DEPLOY READY)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});