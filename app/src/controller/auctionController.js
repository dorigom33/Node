const firebase = require('firebase/app');
require('firebase/database');

const { database } = require('../config/firebase');

const startAuction = async (productId) => {
  const productRef = database.ref("products").child(productId);

  const productSnapshot = await productRef.once("value");
  const product = productSnapshot.val();

  const auctionStartDate = new Date();
  const auctionEndDate = new Date(product.endDate);

  const updateAuctionStatusAndInfo = async () => {
    const currentTime = new Date();
    let updatedData = {
      active: true,
      startDate: auctionStartDate,
      endDate: auctionEndDate,
    };

    // 경매가 종료된 경우 경매 상태를 업데이트
    if (currentTime >= auctionEndDate) {
      updatedData.active = false;
      updatedData.winner = product.highestBidder;
      productRef.update(updatedData);

      // 필요한 종료 작업 수행, 예: 알림 보내기

      return;
    }

    const bidPrice = Math.ceil(product.price * 0.03);
    updatedData.currentBid = product.currentBid + bidPrice;
    productRef.update(updatedData);
  };

  // 경매 진행을 위한 타이머 설정
  const timer = setInterval(async () => {
    updateAuctionStatusAndInfo();
  }, 1000); // 1초마다 경매 정보 업데이트

  // 경매 종료 시 타이머 중지
  setTimeout(() => {
    clearInterval(timer);
  }, auctionEndDate - new Date());
};

const addBid = async (req, userId, productId, bid) => {
  const productRef = database.ref("products").child(productId);
  const productData = (await productRef.once("value")).val();

  const currentTime = Date.now();

  if (req.session.user.lastBidTime &&
      currentTime - req.session.user.lastBidTime < 5 * 60 * 1000) {
    throw new Error("You can only bid once every 5 minutes.");
  }

  if (bid > productData.currentBid) {
    await productRef.update({ ...productData, currentBid: bid, highestBidder: userId });
    req.session.user.lastBidTime = currentTime;
  } else {
    throw new Error("Your bid is too low.")
  }
};


const getProduct = async (productName) => {
  try {
    const productsRef = database.ref('products');
    const productSnapshot = await productsRef.orderByChild('productName').equalTo(productName).once('value');
    console.log('getProduct called with productName:', productName);
    console.log('productSnapshot:', JSON.stringify(productSnapshot, null, 2));

    if (productSnapshot.exists()) {
      const productId = Object.keys(productSnapshot.val())[0]; // Assuming there is only one product with the given name
      const product = productSnapshot.val()[productId];
      return {
        id: productId,
        name: product.productName,
        image: product.imageUrl,
        uploadDate: product.uploadDate,
        endDate: product.endDate,
      };
    } else {
      throw new Error("Product not found");
    }
  } catch (err) {
    throw err;
  }
};



// 경매 컨트롤러를 사용하는 라우터에서 이 함수들을 가져와 사용
module.exports = {
    startAuction,
    addBid,
    getProduct
  };
