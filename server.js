const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors"); // Allow cross-origin requests
const app = express();

app.use(express.json());
app.use(cors()); // Enables frontend apps to access the backend

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/PokePay", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define Auction Schema
const auctionSchema = new mongoose.Schema({
    nftId: { type: String, required: true },
    sellerId: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    buyNowPrice: { type: Number, required: false },
    highestBid: {
        amount: { type: Number, default: 0 },
        userId: { type: String, default: null }
    },
    endTime: { type: Date, required: true },
    status: { type: String, default: "active" }
});

const Auction = mongoose.model("Auction", auctionSchema);

// ✅ Root Test Route
app.get("/", (req, res) => {
    res.send("PokePay server is running!");
});

// ✅ GET Auctions Route (Fixes `Cannot GET` error)
app.get("/api/nfts/auctions", async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ POST Auction Route
app.post("/api/nfts/auctions", async (req, res) => {
    try {
        const newAuction = new Auction(req.body);
        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
