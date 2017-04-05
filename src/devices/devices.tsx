import * as React from "react";
import { connect } from "react-redux";
import { WeedDetector } from "../images";
import { HardwareSettings } from "./components/hardware_settings";
import { FarmbotOsSettings } from "./components/farmbot_os_settings";
import { Farmware } from "../farmware/farmware_panel";
import { Page, Col } from "../ui/index";
import { mapStateToProps } from "./state_to_props";
import { Props } from "./interfaces";

@connect(mapStateToProps)
export class Devices extends React.Component<Props, {}> {
  render() {
    if (this.props.auth) {
      return <Page className="devices">
        <Col xs={12} sm={6}>
          <Farmware bot={this.props.bot} />
          <FarmbotOsSettings
            account={this.props.deviceAccount}
            dispatch={this.props.dispatch}
            bot={this.props.bot}
            auth={this.props.auth} />
        </Col>
        <Col xs={12} sm={6}>
          <WeedDetector
            dispatch={this.props.dispatch}
            bot={this.props.bot}
            images={this.props.images} />
          <HardwareSettings
            dispatch={this.props.dispatch}
            bot={this.props.bot}
          />
        </Col>
      </Page>;
    } else {
      throw new Error("Log in first");
    }
  }
};
