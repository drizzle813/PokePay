const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors'); // Add CORS for safety
const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); // Allow cross-origin requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PokePay', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected')).catch(err => console.error('❌ MongoDB connection error:', err));

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
    status: { type: String, default: 'active' }
});

// Create Auction Model
const Auction = mongoose.model('Auction', auctionSchema);

// Test route
app.get('/', (req, res) => {
    res.send('PokePay server is running!');
});

// ✅ **GET Auctions Endpoint**
app.get('/api/nfts/auctions', async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ **POST Auctions Endpoint**
app.post('/api/nfts/auctions', async (req, res) => {
    try {
        const newAuction = new Auction(req.body);
        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
