const firebase = require('firebase');
const database = firebase.database();

const auctionController = {
  async getProductAuction(productName) {
    return database.ref('auctions/' + productName).once('value');
  },

  async addBid(productName, username, bid) {
    const productAuctionRef = database.ref(`auctions/${productName}`);
    const productSnapshot = await this.getProductAuction(productName);

    const highestBid = productSnapshot.val().highestBid;
    const highestBidder = productSnapshot.val().highestBidder;

    // Check if the new bid is higher than the current highest bid
    if (bid > highestBid) {
      // Update the product with the new highest bid and highest bidder
      productAuctionRef.update({
        highestBid: bid,
        highestBidder: username
      });

      // Add bid under the user's bids for this product
      productAuctionRef.child(`bidders/${username}`).set({
        bid: bid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      });

      // Notify the previous highest bidder (e.g., send an email or push notification)
      // You can implement this by creating a function that sends emails or push notifications
    }
  }
};

module.exports = auctionController;
