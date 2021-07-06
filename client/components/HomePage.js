import React, { useContext, useEffect } from 'react';
import SearchBar from './SearchBar';
import ChartComponent from './ChartComponent';
import { StockContext, StockListContext } from '../Store';
import FindDips from './FindDips';
import axios from 'axios';

const HomePage = (props) => {
  const [stockInfo, dispatchStockInfo] = useContext(StockContext);
  const [stockList, setStockList] = useContext(StockListContext);
  const { info, stockPrices, company } = stockInfo;
  // this useEffect is dummyData to help filter dips
  useEffect(async () => {
    axios.get('/api/stocks').then((data) => {
      setStockList(data.data);
    });
    axios.get('/api/daily-price/APPS').then((data) => {
      const { info, stockPrices } = data.data;
      dispatchStockInfo({ type: 'STOCK_INFO', info, stockPrices });
    });
  }, []);

  useEffect(() => {
    let selectedTicker = stockList.find((ticker) => {
      return ticker.ticker === 'APPS'.toUpperCase();
    });
    dispatchStockInfo({
      type: 'COMPANY_INFO',
      companyInfo: selectedTicker,
    });
  }, [stockList]);

  return (
    <div id='main-container'>
      <div id='title-search'>
        <h1>Buy The Dip - TL</h1>
        <SearchBar />
      </div>
      <div id='title-price-div'>
        {company && (
          <h2>
            {company.name} ({company.ticker})
          </h2>
        )}
        {stockPrices && (
          <h2>
            Stock Price: $
            {Number(stockPrices[stockPrices.length - 1].close).toFixed(2)}
          </h2>
        )}
      </div>
      <div id='chartAndDips'>
        {stockPrices && <ChartComponent />}
        {stockPrices && <FindDips />}
      </div>
    </div>
  );
};

export default HomePage;
