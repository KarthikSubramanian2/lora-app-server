import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";


const styles = {
  fontSize: 12,
};


class ServiceProfileForm extends FormComponent {
  constructor() {
    super();
    this.getNetworkServerOption = this.getNetworkServerOption.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
  }

  getNetworkServerOption(id, callbackFunc) {
    NetworkServerStore.get(id, resp => {
      callbackFunc({label: resp.networkServer.name, value: resp.networkServer.id});
    });
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(0, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        disabled={this.props.disabled}
      >
        <TextField
          id="name"
          label="Service-profile name"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          helperText="A name to identify the service-profile."
          required
          fullWidth
        />
        {!this.props.update && <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.FormLabel} required>Network-server</FormLabel>
          <AutocompleteSelect
            id="networkServerID"
            label="Network-server"
            value={this.state.object.networkServerID || null}
            onChange={this.onChange}
            getOption={this.getNetworkServerOption}
            getOptions={this.getNetworkServerOptions}
          />
          <FormHelperText>
            The network-server on which this service-profile will be provisioned. After creating the service-profile, this value can't be changed.
          </FormHelperText>
        </FormControl>}
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="Add gateway meta-data"
            control={
              <Checkbox
                id="addGWMetaData"
                checked={!!this.state.object.addGWMetaData}
                onChange={this.onChange}
                color="primary"
              />
            }
          />
          <FormHelperText>
            GW metadata (RSSI, SNR, GW geoloc., etc.) are added to the packet sent to the application-server.
          </FormHelperText>
        </FormControl>
        <TextField
          id="devStatusReqFreq"
          label="Device-status request frequency"
          margin="normal"
          type="number"
          value={this.state.object.devStatusReqFreq || 0}
          onChange={this.onChange}
          helperText="Frequency to initiate an End-Device status request (request/day). Set to 0 to disable."
          fullWidth
        />
        {this.state.object.devStatusReqFreq > 0 && <FormControl fullWidth margin="normal">
          <FormGroup row>
            <FormControlLabel
              label="Report device battery level to application-server"
              control={
                <Checkbox
                  id="reportDevStatusBattery"
                  checked={!!this.state.object.reportDevStatusBattery}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormControlLabel
              label="Report device link margin to application-server"
              control={
                <Checkbox
                  id="reportDevStatusMargin"
                  checked={!!this.state.object.reportDevStatusMargin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
          </FormGroup>
        </FormControl>}
        <TextField
          id="drMin"
          label="Minimum allowed data-rate"
          margin="normal"
          type="number"
          value={this.state.object.drMin || 0}
          onChange={this.onChange}
          helperText="Minimum allowed data rate. Used for ADR."
          fullWidth
          required
        />
        <TextField
          id="drMax"
          label="Maximum allowed data-rate"
          margin="normal"
          type="number"
          value={this.state.object.drMax || 0}
          onChange={this.onChange}
          helperText="Maximum allowed data rate. Used for ADR."
          fullWidth
          required
        />
      </Form>
    );
  }
}

export default withStyles(styles)(ServiceProfileForm);
