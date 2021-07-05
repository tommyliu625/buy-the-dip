import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage.js';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={HomePage}></Route>

        {/* <Route exact path='/stockchart' component={StockChartComponent}></Route> */}
        {/* <Route path='/stocknews' component={StockNews}></Route> */}
      </Switch>
    );
  }
}

export default Routes;
