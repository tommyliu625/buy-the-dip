/* eslint-disable complexity */
/* eslint-disable react/jsx-key */
import React, { useState, useContext, useEffect } from 'react';
import { StockContext, StockListContext } from '../Store';
import axios from 'axios';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [searchBarFilter, setSearchBarFilter] = useState([]);
  // const [disable, setDisable] = useState(false);
  const [stockList, setStockList] = useContext(StockListContext);
  const [stockInfo, dispatchStockInfo] = useContext(StockContext);

  // useEffect(() => {
  //   axios.get('/api/stocks').then((data) => {
  //     setStockList(data.data);
  //   });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validTicker = stockList.some((ticker) => {
      return ticker.ticker === keyword.toUpperCase();
    });
    if (validTicker === false) {
      alert('Invalid Input');
    } else {
      const { data } = await axios.get(
        `/api/daily-price/${keyword.toUpperCase()}`
      );
      let { info, stockPrices } = data;
      console.log(info, stockPrices);
      dispatchStockInfo({ type: 'STOCK_INFO', info, stockPrices });
      let selectedTicker = searchBarFilter.find((ticker) => {
        return ticker.ticker === keyword.toUpperCase();
      });
      dispatchStockInfo({ type: 'COMPANY_INFO', companyInfo: selectedTicker });
      // setDisable(false);
    }
  };
  const handleInputChange = (e) => {
    setKeyword(e.target.value);

    filterSearch();
  };
  const filterSearch = () => {
    const filterData = stockList.filter((info, i) => {
      let newKeyword = keyword.toUpperCase();
      return info.ticker.includes(newKeyword);
    });
    const first25Data = filterData.filter((info, i) => {
      return i < 25;
    });
    setSearchBarFilter(first25Data);
  };
  // const handleIntervalMapping = () => {
  //   const min1 = <option value='1min'>1 Min</option>;
  //   const min5 = <option value='5min'>5 Min</option>;
  //   const min15 = <option value='15min'>15 Min</option>;
  //   const min30 = <option value='30min'>30 Min</option>;
  //   const min60 = <option value='60min'>60 Min</option>;
  //   const day = <option value='daily'>Day</option>;
  //   const week = <option value='weekly'>Week</option>;
  //   const month = <option value='monthly'>Month</option>;
  //   let intervalMap = {
  //     intraday: [min1, min5, min15, min30, min60],
  //     '5day': [min5, min15, min30, min60],
  //     '1month': [min60, day],
  //     '3month': [day],
  //     '6month': [day],
  //     '1year': [day, week],
  //     '2year': [day, week],
  //     '5year': [week, month],
  //   };
  //   return intervalMap[timePeriodSelection].map((option) => option);

  return (
    <React.Fragment>
      <form id='stockchart-form'>
        <label>Choose a stock ticker</label>
        <input
          value={keyword}
          onChange={handleInputChange}
          list='tickers'
        ></input>
        <datalist value={keyword} onChange={handleInputChange} id='tickers'>
          <option value='' disabled hidden />
          {searchBarFilter.length &&
            searchBarFilter.map((searches) => {
              return (
                <option value={searches.ticker}>
                  {`${searches.ticker} - ${searches.name}`}
                </option>
              );
            })}
        </datalist>
      </form>
      <button type='submit' onClick={handleSubmit}>
        Submit Info
      </button>
      {/* <div id='time-input-div'> */}
      {/* {disable && (
          <p style={{ color: 'red' }}>Button disabled while data is loading</p>
        )} */}
      {/* </div> */}
    </React.Fragment>
  );
};
export default SearchBar;
