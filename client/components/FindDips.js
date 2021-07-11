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
  const [submittedParameters, setSubmittedParameters] = useState(false);
  const [submittedFilter, setSubmittedFilter] = useState(false);
  const [incorrectFilter, setIncorrectFilter] = useState(false);
  const [returns, setReturns] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [percDip, setPercDip] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    findDips();
    setStartDate('');
    setEndDate('');
    setFilterDips([]);
    setReturnsSubmitted(false);
    setSubmittedFilter(false);
    setPercDip(20);
    setDays(5);
  }, [stockInfo]);
  const findDips = (e) => {
    if (submittedParameters && e) {
      e.preventDefault();
    }
    let dips = [];
    let percent = percDip || 20;
    let daysInput = days || 5;
    let originalPerc = percent / 100;
    console.log(stockPrices);
    for (let i = 0; i < stockPrices.length - daysInput; i++) {
      let perc = originalPerc;
      let curr = (
        (parseFloat(stockPrices[i].close) + parseFloat(stockPrices[i].open)) /
        2
      ).toString();
      let indexTracker = 1;
      let priceTracker = [];
      while (indexTracker <= daysInput) {
        priceTracker.push(stockPrices[i + indexTracker].low);
        indexTracker++;
      }
      // let first = stockPrices[i + 1].low;
      // let second = stockPrices[i + 2].low;
      // let third = stockPrices[i + 3].low;
      // let fourth = stockPrices[i + 4].low;
      // let fifth = stockPrices[i + 5].low;
      let increment = 0;
      priceTracker.forEach((price, i) => {
        if ((curr - price) / curr > perc) {
          perc = (curr - price) / curr;
          increment = i + 1;
        }
      });
      if (perc > originalPerc) {
        dips.push(stockPrices[i + increment]);
        i += increment;
      }
    }
    setSubmittedParameters(true);
    setDips(dips);
    filterDates();
  };
  useEffect(() => {
    setReturnsSubmitted(false);
  }, [filterDips]);
  useEffect(() => {
    // setFilterDips([]);
    // setSubmittedFilter(false);
    filterDates();
    // setStartDate('');
    // setEndDate('');
  }, [dips]);
  const filterDates = (e) => {
    if (e) {
      e.preventDefault();
    }
    console.log('dips', dips);
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
      console.log('filterdips', filteredDips);
      setFilterDips(filteredDips);
    }
  };
  console.log(filterDips);
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
    if (inputsFilled === false || cost === 0) {
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
        <h2>Find Dips</h2>
        <form id='dip-filter' onSubmit={(e) => findDips(e)}>
          <p>Find </p>
          <select
            id='percentDip-input'
            value={percDip}
            onChange={(e) => setPercDip(e.target.value)}
          >
            {[15, 20, 25, 30, 35, 40].map((percent) => {
              return <option value={percent}>{percent}</option>;
            })}
          </select>
          <p> % Dips Within </p>
          <select
            id='days-input'
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            {[5, 6, 7, 8, 9, 10].map((day) => {
              return <option value={day}>{day}</option>;
            })}
          </select>
          <p> Day Periods</p>
          <button id='parameter-button' type='submit'>
            Submit Parameters
          </button>
        </form>
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
          <div className='dips-content'>Add Dips</div>
          <div className='dips-content'>Date</div>
          <div className='dips-content'>Lowest Price</div>
          <div className='dips-content-noborder'>Average Price</div>
        </div>
        {filterDips.length > 0 &&
          !incorrectFilter &&
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
        {submittedFilter && incorrectFilter && filterDips.length > 0 && (
          <p style={{ color: 'red' }}>Invalid Dates.</p>
        )}
      </div>
      <div id='staging-area'>
        <h2>Staging Area</h2>
        <div id='staging-header'>
          <div className='staging-content'></div>
          <div className='staging-content'>Date</div>
          <div className='staging-content'>Shares</div>
          <div className='staging-content'>Price Per Share</div>
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
