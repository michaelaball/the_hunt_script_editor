import React, {Component} from 'react';
import 'react-dropdown/style.css'
import './deploymentDetail.css'
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
        this.toggleRunConfig = this.toggleRunConfig.bind(this);
    }

    componentDidMount() {
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

    toggleRunConfig() {
        this.props.deploymentsModification({
            showRunConfig: !this.props.deployments.showRunConfig,
        });
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
        const activeDeployment = this.activeDeployment();
        var deploymentDetail = null;
        if (activeDeployment) {
            deploymentDetail = (
                <div
                    align="left"
                    className="deploymentDetail">
                    <p><b>ID:</b> {activeDeployment.id}</p>
                    <p><b>Name:</b> {activeDeployment.name}</p>
                    <p><b>Event Subscriptions:</b></p>
                    <ul>
                        {
                            activeDeployment.event_subscriptions ?
                                activeDeployment.event_subscriptions.map((element, index) => {
                                    return (<li key={index}><b>{element.event_name}</b>
                                        {element.subject_table_name} ({element.subject_id}) ->
                                        {element.predicate_table_name} ({element.predicate_id})</li>);
                                }) : null
                        }
                    </ul>
                    <p><b>State:</b></p>
                    <ul>
                        {
                            activeDeployment.state ?
                                activeDeployment.state.map((element, index) => {
                                    return (<li key={index}><b>{element.lookup_key}</b> =
                                        <b> {element.value}</b></li>);
                                }) : null
                        }
                    </ul>
                </div>);
        }
        var runConfig = null;
        if (this.props.deployments.showRunConfig) {
            runConfig = (
                <div>
                    <b>Run Configuration:</b><br/>
                    <label>Event Name:</label>
                    <input
                        type="text"
                        placeholder="Enter event name"
                        defaultValue="init"
                        name="eventName"
                        ref={(input) => this.eventName = input}
                        required/>
                    <label>Parameters:</label>
                    <input
                        type="text"
                        placeholder="Enter parameters"
                        defaultValue="parameters"
                        name="parameters"
                        ref={(input) => this.parameters = input}
                        required/>
                    <label>Subject Table:</label>
                    <input
                        type="text"
                        placeholder="Enter subject table"
                        defaultValue="subjectTable"
                        name="subjectTable"
                        ref={(input) => this.subjectTable = input}
                        required/>
                    <label>Subject ID:</label>
                    <input
                        type="text"
                        placeholder="Enter subject id"
                        defaultValue="init"
                        name="subjectID"
                        ref={(input) => this.subjectID = input}
                        required/>
                    <label>Predicate Table:</label>
                    <input
                        type="text"
                        placeholder="Enter predicate table"
                        defaultValue="init"
                        name="predicateTable"
                        ref={(input) => this.predicateTable = input}
                        required/>
                    <label>Predicate ID:</label>
                    <input
                        type="text"
                        placeholder="Enter predicate id"
                        defaultValue="init"
                        name="predicateID"
                        ref={(input) => this.predicateID = input}
                        required/>
                </div>);
        }
        return (
            <div
                align="left"
                className="deploymentEditorRoot"
                height="auto">
                <div id="buttonDeploymentRow">
                    <button disabled="disabled">New</button>
                    <button onClick={this.refreshDeployments}>Refresh all</button>
                    <button disabled="disabled">Refresh</button>
                    <button disabled="disabled">Save</button>
                    <button disabled="disabled">Run</button>
                    <button onClick={this.toggleRunConfig}>Run config</button>
                    <button disabled="disabled">Delete</button>
                </div>
                {runConfig}
                <div>
                    <label>Choose Deployment:</label>
                    <Dropdown options={options} onChange={this.onSelect} value={defaultOption}
                              placeholder="Select an option"/>
                </div>
                {deploymentDetail}
            </div>
        );
    }

}

export default DeploymentEditor;