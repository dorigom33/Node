const admin = require("firebase-admin");
const db = admin.database();

// 상품 정보를 가져오는 함수
async function getProductInfo(productId) {
  const productSnapshot = await db.ref(`products/${productId}`).once("value");
  const product = productSnapshot.val();
  return product;
}

async function getProductByAuctionId(auctionId) {
  const auctionSnapshot = await db.ref(`auctions/${auctionId}`).once("value");
  const auctionInfo = auctionSnapshot.val();
  const product = await getProductInfo(auctionInfo.productId);
  return product;
}
async function getAuctionByProductId(productId) {
  if (!productId) {
    throw new Error('Missing productId');
  }

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new Error('Product not found');
  }

  const auction = await Auction.findOne({ product: productId });
  if (!auction) {
    throw new Error('Auction not found');
  }

  return auction;
}

// 새로운 경매를 생성하는 함수
async function createAuction(productId) {
  try {
    const product = await getProductInfo(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const newAuctionRef = db.ref("auctions").push();
    const auctionId = newAuctionRef.key;
    const auctionData = {
      productId,
      productName: product.productName,
      currentPrice: Number(product.price),
      highestBidder: "",
      status: "open",
      endTime: Date.now() + 72 * 60 * 60 * 1000,
    };
    
    await newAuctionRef.set(auctionData);

    const auctionRef = db.ref(`auctions/${auctionId}`);
    auctionRef.on("value", async (snapshot) => {
      const auction = snapshot.val();

      if (auction.status === "open" && auction.endTime <= Date.now()) {
        const highestBidder = auction.highestBidder;
        const highestBid = auction.currentPrice;
        const productRef = db.ref(`products/${auction.productId}`);

        await productRef.update({
          highestBidder,
          highestBid,
        });

        await auctionRef.update({
          status: "closed",
        });

        auctionRef.off("value");
      }
    });

    return auctionId;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create auction");
  }
}

// 경매 정보를 가져오는 함수
async function getAuctionInfo(auctionId) {
  const auctionSnapshot = await db.ref(`auctions/${auctionId}`).once("value");
  const auctionInfo = auctionSnapshot.val();
  return auctionInfo;
}

// 입찰을 수행하는 함수
async function placeBid(auctionId, bidderName, bidAmount) {
  try {
    if (!bidderName) {
      throw new Error("Bidder name is required");
    }

    const auctionRef = db.ref(`auctions/${auctionId}`);
    const auctionSnapshot = await auctionRef.once("value");
    const auction = auctionSnapshot.val();

    if (Number(bidAmount) > 0) {
      await auctionRef.update({
        currentPrice: Number(auction.currentPrice) + Number(bidAmount),
        highestBidder: bidderName,
      });
    } else {
      throw new Error("Bid amount is not higher than the current highest bid");
    }
    
  } catch (error) {
    console.error(error);
    throw new Error("Failed to place bid");
  }
}

// 상품에 대한 경매가 있는지 확인하는 함수
async function isAuctionExistsForProduct(productId) {
  const auctionsSnapshot = await db.ref("auctions").once("value");
  const auctions = auctionsSnapshot.val();
  for (const auctionId in auctions) {
    if (auctions[auctionId].productId === productId) {
      return auctionId; // 경매 ID 반환
    }
  }
  return null; // 해당 상품에 대한 경매가 없음
}

// 기존 경매를 찾거나 새로운 경매를 생성하는 함수
async function createAuctionByProductId(productId) {
  try {
    // 먼저 상품 ID로 이미 경매가 진행 중인지 확인합니다.
    const existingAuctionId = await isAuctionExistsForProduct(productId);
    if (existingAuctionId) {
      const existingAuction = await getAuctionInfo(existingAuctionId);
      return { auctionId: existingAuctionId, auctionInfo: existingAuction };
    }

    // 새로운 경매 생성
    const newAuctionId = await createAuction(productId);
    const newAuction = await getAuctionInfo(newAuctionId);
    return { auctionId: newAuctionId, auctionInfo: newAuction };
  } catch (err) {
    console.error("Failed to create auction for product ID", productId, err.message);
    throw new Error("Failed to create auction");
  }
}

async function getAuctionByProductId(productId) {
  if (!productId) {
    throw new Error('Missing productId');
  }

  const productSnapshot = await db.ref(`products/${productId}`).once('value');
  const product = productSnapshot.val();

  if (!product) {
    throw new Error('Product not found');
  }

  const auctionSnapshot = await db.ref('auctions').orderByChild('productId').equalTo(productId).once('value');
  const auctionData = auctionSnapshot.val();

  if (!auctionData) {
    throw new Error('Auction not found');
  }

  const auctionId = Object.keys(auctionData)[0];
  const auction = auctionData[auctionId];
  return { auctionId, auction };
}


module.exports = {
  createAuction,
  getAuctionInfo,
  placeBid,
  createAuctionByProductId,
  isAuctionExistsForProduct,
  getProductByAuctionId,
  getAuctionByProductId,
};