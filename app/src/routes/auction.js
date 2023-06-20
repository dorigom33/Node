document.getElementById('submit_bid_button').addEventListener('click', async () => {
    const username = document.getElementById('username').innerText;
    const productName = document.getElementById('productName').innerText;
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);
  
    const response = await fetch('/addBid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productName,
        username,
        bid: bidAmount
      })
    });
  
    if (response.ok) {
      alert('Bid submitted successfully.');
    } else {
      const error = await response.json();
      alert('Error submitting bid: ' + error.message);
    }
  });
  