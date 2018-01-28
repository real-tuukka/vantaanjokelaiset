import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

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
      <div className="controls controls-input">
        <label for="flow" className="controls-label">Flow velocity (m/s)</label>
        <input type="number" className="controls-field" id="flow" value={this.state.flow} onChange={this.handleFlowChange} />
        <label for="bypass" className="controls-label">Amount of water to bypass (m3)</label>
        <input type="number" className="controls-field" id="bypass" value={this.state.bypass} onChange={this.handleBypassChange} />
        <FlatButton label="Run Simulation" onClick={this.handleUpdate} backgroundColor='#1ce0f2'/>
      </div>
    );
  }
}