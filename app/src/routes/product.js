const express = require('express');
const multer = require('multer');
const productController = require('../controller/productController');
const auctionController = require('../controller/auctionController'); // 경매 컨트롤러 추가

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 상품 이미지 업로드 라우터
router.post('/upload', productController.upload.single('image'), productController.addProduct);

// 상품 이미지 업로드 페이지 표시
router.get('/upload', (req, res) => {
  res.render('product/upload');
});

router.get('/productlist', async (req, res) => {
  try {
    const productsList = await productController.getProductsList();
    res.status(200).render('product/productlist', { productsList: productsList });
  } catch (err) {
    console.error('Error while fetching products:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.get('/product/:productId/auction', async (req, res) => {
  const productId = req.params.productId;

  try {
    // 경매 생성 및 경매 ID 가져오기
    const auctionId = await auctionController.createAuctionByProductId(productId);

    // 경매 페이지로 리다이렉트
    res.redirect(`/auction/${auctionId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create auction' });
  }
});

module.exports = router;
