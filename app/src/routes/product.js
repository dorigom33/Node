const express = require('express');
const multer = require('multer');
const productController = require('../controller/productController');

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

// 상품 클릭 시 해당 상품 페이지로 리다이렉션
router.get('/product/:productId', (req, res) => {
  res.redirect(`/auction/product/${req.params.productId}`);
});




module.exports = router;
