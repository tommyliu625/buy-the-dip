export default (state = {}, action) => {
  switch (action.type) {
    case 'STOCK_INFO':
      return {
        ...state,
        info: action.info,
        stockPrices: action.stockPrices,
      };
    case 'COMPANY_INFO':
      return { ...state, company: action.companyInfo };
    default:
      return state;
  }
};
