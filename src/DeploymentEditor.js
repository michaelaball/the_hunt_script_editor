import React, {Component} from 'react';
import 'react-dropdown/style.css'
import Dropdown from 'react-dropdown';

const superagent = require('superagent');

const deploymentsEndpoint = "/script_deployments";

class DeploymentEditor extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.activeDeployment = this.activeDeployment.bind(this);
        this.activeDeploymentIndex = this.activeDeploymentIndex.bind(this);
        this.selectedDeployment = this.selectedDeployment.bind(this);
        this.refreshDeployments = this.refreshDeployments.bind(this);

        if (undefined === this.props.deployments) {
            this.props.deploymentsModification(
                {
                    deployments: [],
                    selected: undefined,
                }
            );
        }
        this.refreshDeployments();
    }

    onSelect(deployment) {
        this.props.deploymentsModification({
            selected: deployment.value,
        });
    }

    activeDeployment() {
        return this.props.deployments.deployments.find((element) => element.id === this.props.deployments.selected)
    }

    activeDeploymentIndex() {
        return this.props.deployments.deployments.indexOf(this.activeDeployment());
    }

    selectedDeployment() {
        var deployment = this.activeDeployment();
        if (deployment) {
            return {
                label: deployment.name,
                value: deployment.id,
            }
        } else {
            return null;
        }
    }

    refreshDeployments() {
        const scriptID = this.props.script.id;
        superagent.get(this.props.login.endpoint + deploymentsEndpoint)
            .set("api_key", this.props.login.token)
            .query({definitionID: scriptID})
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    return console.log(err);
                }
                console.log(res);
                var first = -1;
                if (res.body.length > 0) {
                    first = res.body[0].id;
                }
                this.props.deploymentsModification({
                    deployments: res.body,
                    selected: this.props.deployments.selected ? this.props.deployments.selected : first,
                });
            });
    }

    render() {
        if (undefined === this.props.deployments) {
            return null;
        }
        var deployments = this.props.deployments.deployments;
        const options = deployments.map(deployment => {
            return {
                label: deployment.name,
                value: deployment.id,
            };
        });
        const defaultOption = this.selectedDeployment();
        return (
            <div>
                <div id="buttonDeploymentRow">
                    <button disabled="disabled">New</button>
                    <button onClick={this.refreshDeployments}>Refresh all</button>
                    <button disabled="disabled">Refresh</button>
                    <button disabled="disabled">Save</button>
                    <button disabled="disabled">Run</button>
                    <button disabled="disabled">Delete</button>
                </div>
                <div>
                    <Dropdown options={options} onChange={this.onSelect} value={defaultOption}
                              placeholder="Select an option"/>
                </div>
            </div>
        );
    }

}

export default DeploymentEditor;