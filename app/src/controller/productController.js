const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const bucket = admin.storage().bucket();
const db = admin.database();

const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return callback(err);
        callback(null, raw.toString('hex') + path.extname(file.originalname));
      });
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'));
    }
    callback(null, true);
  },
});

const addProduct = async (req, res) => {
  const { productName, description, category } = req.body;
  const price = parseFloat(req.body.price);
  const filePath = req.file.path;
  const userName = req.session.userName; // 세션에서 userName 가져오기

  try {
    const [file] = await bucket.upload(filePath, {
      public: true,
    });

    const imageUrl = file?.metadata?.mediaLink;
    if (!imageUrl) {
      throw new Error('Failed to retrieve image URL');
    }

    const endDate = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const uploadDate = new Date();

    const newProduct = {
      productName,
      price,
      description,
      category,
      userName,
      imageUrl,
      uploadDate: uploadDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    await db.ref('products').push(newProduct);

    // Image and information saved successfully, redirect to /productlist
    res.redirect('/productlist');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image and save information' });
  }
};


const getProductsList = async () => {
  const productsRef = db.ref('products');
  const snapshot = await productsRef.once('value');
  const allProducts = snapshot.val();
  const productsList = Object.keys(allProducts).map((productId) => ({
    id: productId,
    ...allProducts[productId],
  }));

  return productsList;
};




module.exports = { addProduct, upload, getProductsList };
