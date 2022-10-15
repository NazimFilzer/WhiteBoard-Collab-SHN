import React from 'react';

import { Component } from 'react'

import TradingViewStockChartWidget from 'react-tradingview-components'

class Example extends Component {
  render() {
    return <TradingViewStockChartWidget 
              symbol='NASDAQ:AAPL'
              theme='Dark' 
              range='12m'
            />
  }
}

export default Navstock