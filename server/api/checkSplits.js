const checkSplits = (arr) => {
  let stockSplit = 1;
  return arr.map((price, i) => {
    let prevPrice = i < arr.length - 1 ? arr[i + 1].close : 0;
    if (Math.floor(prevPrice / price.open + 0.09) > 1) {
      stockSplit *= Math.floor(prevPrice / price.open + 0.09);
      console.log(prevPrice / price.open + 0.09, stockSplit, price.time);
    } else if (stockSplit > 1) {
      price.open = parseFloat(price.open / stockSplit);
      price.high = parseFloat(price.high / stockSplit);
      price.low = parseFloat(price.low / stockSplit);
      price.close = parseFloat(price.close / stockSplit);
    }
    return price;
  });
};

module.exports = checkSplits;
