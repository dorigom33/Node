const express = require('express');
const router = express.Router();

const admin = require('firebase-admin');
const db = admin.database();

const auctionController = require('../controller/auctionController');

router.get("/auction/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await auctionController.createAuctionByProductId(productId);
    res.status(200).render("product/auction", {
      auctionId: result.auctionId,
      auctionInfo: result.auctionInfo,
    });
  } catch (err) {
    console.error("Error while finding or creating auction:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

router.post('/auction/bid/:auctionId', async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bidAmount = req.body.bidAmount;
    const bidderName = req.session.userName;
    await auctionController.placeBid(auctionId, bidderName, bidAmount);
    res.status(200).json({ message: 'Bid placed successfully' });
  } catch (err) {
    console.error('Error while placing bid:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.post("/auction/:auctionId/placeBid", async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidAmount } = req.body;
    const bidderName = req.session.userName;

    await auctionController.placeBid(auctionId, bidderName, bidAmount);

    // 경매 페이지로 올바른 리디렉션 경로를 사용하도록 수정
    res.redirect(`/auction/product/${(await auctionController.getProductByAuctionId(auctionId)).id}`);
  } catch (err) {
    console.error("Error while placing bid:", err.message);
    res.status(400).json({ success: false, msg: err.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    // 라우트 처리 로직, 어떤 요청 페이로드에 따라 productId가 정의되어야 함
    const productId = req.body.productId;
    const result = await auctionController.createAuctionByProductId(productId);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error while creating auction: ${error}`);
    res.status(500).json({ message: 'Failed to create auction' });
  }
});

module.exports = router;
