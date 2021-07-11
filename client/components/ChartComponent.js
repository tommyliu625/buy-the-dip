// import Chart from 'chart.js'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StockContext } from '../Store';
import { createChart, CrosshairMode } from 'lightweight-charts';

let chart;
let candlestickSeries;

const ChartComponent = () => {
  const [stockInfo, dispatchStockInfo] = useContext(StockContext);
  const { stockPrices } = stockInfo;
  const ref = React.useRef();
  let chartWidth = Math.floor(window.innerWidth / 3);
  console.log(ref);
  useEffect(() => {
    chart = createChart(ref.current, {
      width: chartWidth,
      height: (chartWidth * 2) / 3,
    });
    chart.applyOptions({
      timeScale: {
        // rightOffset: 45,
        barSpacing: 15,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
      },
      priceScale: {
        position: 'right',
        // mode: 1,
        autoScale: true,
        // invertScale: true,
        alignLabels: true,
        borderVisible: false,
        borderColor: '#555ffd',
        // scaleMargins: {
        //   top: 0.65,
        //   bottom: 0.25,
        // },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        grid: {
          vertLines: {
            color: 'rgba(70, 130, 180, 0.5)',
            // style: 1,
            // visible: true,
          },
          horzLines: {
            color: 'rgba(70, 130, 180, 0.5)',
            // style: 1,
            // visible: true,
          },
        },
      },
    });
    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0B6623',
      downColor: '#FF6347',
      borderVisible: false,
      wickVisible: true,
      borderColor: '#000000',
      wickColor: '#000000',
      borderUpColor: '#4682B4',
      borderDownColor: '#A52A2A',
      wickUpColor: '#4682B4',
      wickDownColor: '#A52A2A',
    });
    candlestickSeries.setData(stockPrices);
  }, []);
  React.useEffect(() => {
    candlestickSeries.setData(stockPrices);
  }, [stockPrices]);
  console.log(ref.current);
  return (
    <>
      <div id='chart'>
        <h2 style={{ textAlign: 'center' }}>Candlestick Chart</h2>
        <div ref={ref} />
      </div>
    </>
  );
};

export default ChartComponent;
