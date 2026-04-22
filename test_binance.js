const axios = require('axios');

async function test() {
  const url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";
  const data = {
        "fiat": "VES",
        "asset": "USDT",
        "tradeType": "BUY",
        "page": 1,
        "rows": 1,
        "countries": [],
        "proMerchantAds": false,
        "shieldMerchantAds": false,
        "filterType": "tradable",
        "periods": [15],
        "additionalKycVerifyFilter": 1,
        "publisherType": "merchant",
        "payTypes": ["PagoMovil"],
        "classifies": ["mass", "profession", "fiat_trade"],
        "tradedWith": false,
        "followed": false,
  };
  try {
    const res = await axios.post(url, data, { headers: { "Content-Type": "application/json" } });
    console.log(res.data.data[0].adv.price);
  } catch (e) {
    console.error(e.message);
  }
}
test();
