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
        Submit Ticker
      </button>
    </React.Fragment>
  );
};
export default SearchBar;
