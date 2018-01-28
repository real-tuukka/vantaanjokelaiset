import React from 'react';
import { Map } from './Map.js';
import { Controls } from './Controls.js';

export class MapApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      'flow': 1,
      'bypass': 100.0,
    };

    this.update = this.update.bind(this);
  }

  update(flow, bypass) {
    this.setState({ flow, bypass });
  }

  render() {
    return (
      <div>
        <Controls flow={this.state.flow} bypass={this.state.bypass} update={this.update} />
        <Map flow={this.state.flow} bypass={this.state.bypass} />
      </div>
    );
  }
}