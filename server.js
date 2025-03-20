const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("enter ur mongo db string", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
    
});
const User = mongoose.model("User", UserSchema);

// Legal Text Schema
const LegalTextSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    text: String,
    createdAt: { type: Date, default: Date.now }
});
const LegalText = mongoose.model("LegalText", LegalTextSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists!" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.json({ message: "Signup successful!" });
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.json({ message: "Invalid email or password" });
    }

    res.json({ message: `Welcome, ${user.name}!`, userId: user._id });
});

// Store Legal Text Route (only if logged in)
app.post("/submit-text", async (req, res) => {
    const { userId, text } = req.body;

    if (!userId || !text) {
        return res.json({ message: "Missing user ID or text" });
    }

    const newText = new LegalText({ userId, text });
    await newText.save();

    res.json({ message: "Text stored successfully!" });
});

// Fetch User's Legal Texts
app.post("/get-texts", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.json({ message: "User not found" });

    const texts = await LegalText.find({ userId });
    res.json(texts);
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
