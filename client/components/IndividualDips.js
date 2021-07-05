import React, { useState } from 'react';

export default function IndividualDips(props) {
  const [shares, setShares] = useState();
  const [cost, setCost] = useState();
  const { filterDips, setFilterDips, dip } = props;
  let { day, month, year } = dip.time;
  let { open, high, low, close } = dip;
  let avg =
    (parseFloat(open) +
      parseFloat(high) +
      parseFloat(low) +
      parseFloat(close)) /
    4;
  function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }
  function numberWithCommas(x) {
    x = toFixed(x, 2);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const unstage = () => {
    dip.staged = false;
    setFilterDips([...filterDips]);
  };
  const changeShares = (e) => {
    dip.shares = e.target.value;
    setShares(e.target.value);
    setFilterDips([...filterDips]);
  };
  const changeCost = (e) => {
    dip.cost = e.target.value;
    setCost(e.target.value);
    setFilterDips([...filterDips]);
  };
  return (
    <div className='staging-items'>
      <div className='staging-content'>
        <button onClick={() => unstage()}>X</button>
      </div>
      <div className='staging-content'>{`${month}-${day}-${year}`}</div>
      <div className='staging-content'>
        <input
          onChange={(e) => changeShares(e)}
          placeholder='Ex: 100'
          type='number'
          min='0'
          step='1'
          style={{ width: '60px' }}
          value={shares}
        />
      </div>
      <div className='staging-content'>
        <input
          onChange={(e) => changeCost(e)}
          placeholder={`$${toFixed(low, 2)}-$${toFixed(avg, 2)}`}
          type='number'
          min={`${low}`}
          max={`${avg}`}
          step='0.01'
          style={{ width: '120px' }}
          value={cost}
        />
      </div>
      <div className='staging-content'>
        {cost && shares ? `$${numberWithCommas(cost * shares)}` : '$0'}
      </div>
    </div>
  );
}
