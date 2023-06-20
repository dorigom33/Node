const express = require("express");
const auctionController = require("../controller/auctionController");

const router = express.Router();

router.get('/product/:productName', async (req, res) => {
    try {
      const product = await auctionController.getProduct(req.params.productName);
      res.status(200).render('product/auction', { product });
    } catch (err) {
      console.error('Error while fetching product for auction:', err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  });
  
// 경매 시작 엔드포인트
router.post("/start/:productId", async (req, res) => {
    try {
        await auctionController.startAuction(req.params.productId);
        res.status(200).json({ message: "Auction started successfully" });
    } catch (err) {
        console.error("Error while starting auction:", err);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

// 경매 입찰 엔드포인트
router.post("/bid/:productId/:userId", async (req, res) => {
    try {
        const bid = parseFloat(req.body.bid);
        await auctionController.addBid(req.params.productId, req.params.userId, bid);
        res.status(200).json({ message: "Bid added successfully" });
    } catch (err) {
        console.error("Error while adding bid:", err);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

module.exports = router;
