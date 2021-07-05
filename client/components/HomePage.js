import React, { useContext, useEffect } from 'react';
import SearchBar from './SearchBar';
import ChartComponent from './ChartComponent';
import { StockContext, StockListContext } from '../Store';
import FindDips from './FindDips';
import dummyData from '../dummyDailyPrice';

const HomePage = (props) => {
  const [stockInfo, dispatchStockInfo] = useContext(StockContext);
  const [stockList, setStockList] = useContext(StockListContext);
  const { info, stockPrices, company } = stockInfo;
  // this useEffect is dummyData to help filter dips
  // useEffect(() => {
  //   dispatchStockInfo({
  //     type: 'STOCK_INFO',
  //     info: dummyData.info,
  //     stockPrices: dummyData.stockPrices,
  //   });
  // }, []);
  return (
    <div id='main-container'>
      <div id='title-search'>
        <h1>Buy The Dip - TL</h1>
        <SearchBar />
      </div>
      <div id='title-price-div'>
        {company && <span>{company.name}</span>}
        {stockPrices && (
          <span>
            Stock Price: $
            {Number(stockPrices[stockPrices.length - 1].close).toFixed(2)}
          </span>
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
