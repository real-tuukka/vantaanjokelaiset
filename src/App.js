import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import { MapApp } from './MapApp.js';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <MapApp /> 
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
