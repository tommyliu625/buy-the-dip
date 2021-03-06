import React, { useState, useReducer } from 'react';
import singleStockReducer from './reducer/singleStockReducer';
import axios from 'axios';
// create a context (similar to when components call connect on redux))
export const StockContext = React.createContext({});
export const StockListContext = React.createContext({});

let res;
axios.get('/api/stocks').then((data) => {
  res = data.data;
});
const Store = ({ children }) => {
  // similar to mapState & mapProps]
  const [stockInfo, dispatchStockInfo] = useReducer(singleStockReducer, {});
  const [stockList, setStockList] = useState([]);
  // setStockList(res);
  return (
    // ReceiptDataContext gives all components access to receiptDataState
    <StockContext.Provider value={[stockInfo, dispatchStockInfo]}>
      <StockListContext.Provider value={[stockList, setStockList]}>
        {children}
      </StockListContext.Provider>
    </StockContext.Provider>
  );
};

export default Store;
