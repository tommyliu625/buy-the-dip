import React, { useContext, useEffect, useState } from 'react';
import { StockContext } from '../Store';
import StagingArea from './StagingArea';
import IndividualDips from './IndividualDips';

const FindDips = () => {
  const [stockInfo, dispatchStockInfo] = useContext(StockContext);
  const { stockPrices } = stockInfo;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterDips, setFilterDips] = useState([]);
  const [dips, setDips] = useState([]);
  const [returnsSubmitted, setReturnsSubmitted] = useState(false);
  const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
  const [submittedFilter, setSubmittedFilter] = useState(false);
  const [incorrectFilter, setIncorrectFilter] = useState(false);
  const [returns, setReturns] = useState({});
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    findDips();
    setStartDate('');
    setEndDate('');
    setFilterDips([]);
    setReturnsSubmitted(false);
    setSubmittedFilter(false);
  }, [stockInfo]);
  const findDips = (year = 0) => {
    let dips = [];
    for (let i = 0; i < stockPrices.length - 5; i++) {
      let curr = (
        (parseFloat(stockPrices[i].close) + parseFloat(stockPrices[i].open)) /
        2
      ).toString();
      let perc = 0.2;
      let first = stockPrices[i + 1].low;
      let second = stockPrices[i + 2].low;
      let third = stockPrices[i + 3].low;
      let fourth = stockPrices[i + 4].low;
      let fifth = stockPrices[i + 5].low;
      let currDip;
      let increment = 0;
      [first, second, third, fourth, fifth].forEach((price, i) => {
        if ((curr - price) / curr > perc) {
          perc = (curr - price) / curr;
          increment = i + 1;
          currDip = price;
        }
      });
      if (perc > 0.2) {
        dips.push(stockPrices[i + increment]);
        i += increment;
      }
    }
    setDips(dips);
  };
  useEffect(() => {
    setReturnsSubmitted(false);
  }, [filterDips]);

  const filterDates = (e) => {
    e.preventDefault();
    setSubmittedFilter(true);
    const [sYear, sMonth, sDay] = startDate.split('-');
    const [eYear, eMonth, eDay] = endDate.split('-');
    const sDate = Date.parse([sMonth, sDay, sYear].join('/'));
    const eDate = Date.parse([eMonth, eDay, eYear].join('/'));
    if (eDate < sDate || !startDate || !endDate) {
      setIncorrectFilter(true);
    } else {
      setIncorrectFilter(false);
      let filteredDips = dips.filter((dip) => {
        const { year, month, day } = dip.time;

        const checkDate = Date.parse([month, day, year]);
        return eDate >= checkDate && checkDate >= sDate;
      });
      setFilterDips(filteredDips);
    }
  };

  const addStagingArea = (dip) => {
    dip.staged = true;
    setFilterDips([...filterDips]);
  };

  function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }
  function numberWithCommas(x) {
    x = toFixed(x, 2);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const calculateReturns = (e) => {
    e.preventDefault();
    let cost = 0;
    let shares = 0;
    let curr = stockPrices[stockPrices.length - 1].close;
    let inputsFilled = true;

    for (let i = 0; i < filterDips.length; i++) {
      let dip = filterDips[i];
      if (dip.staged) {
        if (dip.cost > 0 && dip.shares > 0) {
          shares += parseFloat(dip.shares);
          cost += parseFloat(dip.cost) * dip.shares;
          setTotalCost(cost);
        } else {
          inputsFilled = false;
          break;
        }
      }
    }
    if (inputsFilled === false) {
      setReturnsSubmitted(true);
      setSubmittedCorrectly(false);
    } else {
      setReturnsSubmitted(true);
      setSubmittedCorrectly(true);
      let totalCurr = parseFloat(curr) * shares;
      let returns = {};
      returns.RoR = toFixed(((totalCurr - cost) / cost) * 100, 2);
      returns.totalReturns = totalCurr - cost;
      setReturns(returns);
    }
  };
  return (
    <>
      <div id='dipsFound'>
        <h2>Identified Dips</h2>
        <form id='input-date-div' onSubmit={filterDates}>
          <input
            id='event-input'
            type='date'
            placeholder=''
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            id='event-input'
            type='date'
            placeholder=''
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button type='submit'>Filter Dates</button>
        </form>
        <div id='dips-table'>
          <div className='dips-content'>Staging Area</div>
          <div className='dips-content'>Date</div>
          <div className='dips-content'>Lowest Price</div>
          <div className='dips-content-noborder'>Average Price</div>
        </div>
        {filterDips.length > 0 &&
          filterDips.map((dip) => {
            let { day, month, year } = dip.time;
            let { open, high, low, close } = dip;
            let avg =
              (parseFloat(open) +
                parseFloat(high) +
                parseFloat(low) +
                parseFloat(close)) /
              4;
            if (!dip.staged) {
              return (
                <div className='dips-info'>
                  <div className='dips-content'>
                    <button type='button' onClick={() => addStagingArea(dip)}>
                      Add Dip
                    </button>
                  </div>
                  <div className='dips-content'>
                    <span>{`${month}-${day}-${year}`}</span>
                  </div>
                  <div className='dips-content'>
                    <span>${toFixed(low, 2)}</span>
                  </div>
                  <div className='dips-content-noborder'>
                    <span>${toFixed(avg, 2)}</span>
                  </div>
                </div>
              );
            }
          })}
        {submittedFilter && !incorrectFilter && filterDips.length === 0 && (
          <p style={{ color: 'red' }}>
            No sigificant dips found. Please widen your search parameters or
            choose another stock.
          </p>
        )}
        {submittedFilter && incorrectFilter && (
          <p style={{ color: 'red' }}>Invalid Dates.</p>
        )}
      </div>
      <div id='staging-area'>
        <h2>Staging Area</h2>
        <div id='staging-header'>
          <div className='staging-content'></div>
          <div className='staging-content'>Date</div>
          <div className='staging-content'>Shares</div>
          <div className='staging-content'>Cost</div>
          <div className='staging-content'>Total</div>
        </div>
        {filterDips.length > 0 &&
          filterDips.map((dip) => {
            if (dip.staged) {
              return (
                <IndividualDips
                  dip={dip}
                  filterDips={filterDips}
                  setFilterDips={setFilterDips}
                />
              );
            }
          })}
        <div>
          {returnsSubmitted && submittedCorrectly ? (
            <p className='totalCost'>
              Total Cost = ${numberWithCommas(totalCost)}
            </p>
          ) : (
            <p className='totalCost'>
              Total Cost = (Calculate Returns First...)
            </p>
          )}
        </div>
        <div id='currPrice-returnButton'>
          <p>
            Current price $
            {toFixed(stockPrices[stockPrices.length - 1].close, 2)}
          </p>
          <button type='submit' onClick={(e) => calculateReturns(e)}>
            Calculate Returns
          </button>
        </div>
        {returnsSubmitted && submittedCorrectly && (
          <div id='returns-div'>
            <p>Rate of Return: {returns.RoR}%</p>
            <p>Total Return: ${numberWithCommas(returns.totalReturns)}</p>
          </div>
        )}
        {returnsSubmitted && !submittedCorrectly && <p>Invalid Inputs</p>}
      </div>
    </>
  );
};

export default FindDips;
