import React from 'react';
import FlatButton from 'material-ui/FlatButton';

export class Controls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flow: props.flow,
      bypass: props.bypass,
    };

    this.handleBypassChange = this.handleBypassChange.bind(this);
    this.handleFlowChange = this.handleFlowChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleBypassChange(e) {
    this.setState({ bypass: parseFloat(e.target.value) });
  }

  handleFlowChange(e) {
    this.setState({ flow: parseFloat(e.target.value) });
  }

  handleUpdate() {
    this.props.update(this.state.flow, this.state.bypass);
  }

  render() {
    return (
      <div>
        <div className="controls controls-input">
          <label htmlFor="flow" className="controls-label">Flow velocity (m/s)</label>
          <input type="number" className="controls-field" id="flow" value={this.state.flow} onChange={this.handleFlowChange} />
          <label htmlFor="bypass" className="controls-label">Water to bypass (m3)</label>
          <input type="number" className="controls-field" id="bypass" value={this.state.bypass} onChange={this.handleBypassChange} />
          <FlatButton label="Run" className="controls-field" onClick={this.handleUpdate} backgroundColor='#1ce0f2'/>
        </div>
        <div className="description">
          This application was created for&nbsp;
          <a href="http://www.karttakeskus.fi/water-hackathon/">
          Water Hackathon
          </a>
          , organized by Aalto University and CGI.
          <br />
          Data for channel network is from&nbsp;
          <a href="http://www.syke.fi/fi-FI/Avoin_tieto">
          SYKE Open Data.
          </a>
        </div>
      </div>
    );
  }
}