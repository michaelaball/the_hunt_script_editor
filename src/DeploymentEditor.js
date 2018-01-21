import React, {Component} from 'react';
import 'react-dropdown/style.css'
import Dropdown from 'react-dropdown';

class DeploymentEditor extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.activeDeployment = this.activeDeployment.bind(this);
        this.activeDeploymentIndex = this.activeDeploymentIndex.bind(this);

        if (undefined === this.props.deployments) {
            this.props.deploymentsModification(
                {
                    deployments: [
                        {id: 51, name: "hello", description: "test"},
                        {id: 53, name: "hello53", description: "test53"},
                    ],
                    selected: {label: "hello", value: 51},
                }
            );
        }
    }

    onSelect(deployment) {
        this.props.deploymentsModification({
            selected: deployment,
        });
    }

    activeDeployment() {
        return this.props.deployments.deployments.find((element) => element.id === this.props.deployments.selected)
    }

    activeDeploymentIndex() {
        return this.props.deployments.deployments.indexOf(this.activeDeployment());
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
        const defaultOption = this.props.deployments.selected;
        return (
            <div>
                <div id="buttonDeploymentRow">
                    <button>New</button>
                    <button>Refresh all</button>
                    <button>Refresh</button>
                    <button>Save</button>
                    <button>Run</button>
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