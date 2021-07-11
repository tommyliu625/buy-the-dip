/* eslint-disable camelcase */
const router = require('express').Router();
const dummyData = require('./dummyDailyPrice');
let alphaKey =
  process.env.NODE_ENV === 'production'
    ? // ? JSON.parse(process.env.alphaKey)
      process.env.alphaKey
    : require('../../secrets').alphaKey.key;
const alpha = require('alphavantage')({ key: alphaKey });
const checkSplits = require('./checkSplits');

router.get('/:ticker', async (req, res, next) => {
  try {
    // let { timePeriodSelection, interval, ticker } = req.body;
    console.log('inside back end');
    const data = await alpha.data.daily(req.params.ticker, 'full', 'json');
    const timeSeries = data['Time Series (Daily)'];
    const timeSeriesArr = Object.keys(timeSeries).map((info) => {
      let objInfo = {
        time: info,
        open: timeSeries[info]['1. open'],
        high: timeSeries[info]['2. high'],
        low: timeSeries[info]['3. low'],
        close: timeSeries[info]['4. close'],
        volume: timeSeries[info]['5. volume'],
      };
      return objInfo;
    });
    data['Meta Data']['4. Interval'] = 'daily';
    const stockSplitAdjusted = checkSplits(timeSeriesArr);
    const stockInfo = {
      info: data['Meta Data'],
      stockPrices: stockSplitAdjusted.reverse(),
    };
    res.send(stockInfo);
  } catch (err) {
    next(err);
  }
});

// router.get('/test', async (req, res, next) => {
//   try {
//     res.send(dummyData);
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/dipFinder', (req, res, next) => {
//   let reverse = dummyData.stockPrices.reverse();
//   let dips = [];
//   for (let i = 0; i < reverse.length - 5; i++) {
//     let curr = (
//       (parseFloat(reverse[i].close) + parseFloat(reverse[i].open)) /
//       2
//     ).toString();
//     let perc = 0.2;
//     let first = reverse[i + 1].low;
//     let second = reverse[i + 2].low;
//     let third = reverse[i + 3].low;
//     let fourth = reverse[i + 4].low;
//     let fifth = reverse[i + 5].low;
//     let currDip;
//     let increment = 0;
//     [first, second, third, fourth, fifth].forEach((price, i) => {
//       if ((curr - price) / curr > perc) {
//         perc = (curr - price) / curr;
//         increment = i + 1;
//         currDip = price;
//       }
//     });
//     if (perc > 0.2) {
//       dips.push(reverse[i + increment]);
//       i += increment;
//     }
//   }
// let filter10year = dips.filter((info) => {
//   let year = parseInt(info.time.slice(0, 4));
//   return year >= 2020;
// });
//   res.send(dips);
// });

module.exports = router;
