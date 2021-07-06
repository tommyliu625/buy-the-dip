import axios from 'axios';

const PresetStockInfo = async () => {
  const presetStockInfo = {};
  // let res = await axios.get('/api/daily-price/APPS');
  // let { info, stockPrices } = res.data;
  // presetStockInfo.APPSPrices = stockPrices;

  let stockList = await axios.get('/api/stocks');
  presetStockInfo.initialStockList = stockList.data;
  return presetStockInfo;
};
export default PresetStockInfo;
