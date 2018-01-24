import React, {Component} from 'react';
import EditDeploymentModal from './EditDeploymentModal'
import 'react-dropdown/style.css'
import './deploymentDetail.css'
import Dropdown from 'react-dropdown';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const superagent = require('superagent');

const deploymentsEndpoint = "/script_deployments";
const deploymentsRunEndpoint = "/script_deployments/run";

class DeploymentEditor extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.activeDeployment = this.activeDeployment.bind(this);
        this.activeDeploymentIndex = this.activeDeploymentIndex.bind(this);
        this.selectedDeployment = this.selectedDeployment.bind(this);
        this.refreshDeployments = this.refreshDeployments.bind(this);
        this.toggleRunConfig = this.toggleRunConfig.bind(this);
        this.onClickNew = this.onClickNew.bind(this);
        this.saveNewDeployment = this.saveNewDeployment.bind(this);
        this.addOrUpdateDeployment = this.addOrUpdateDeployment.bind(this);
        this.onClickRun = this.onClickRun.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
    }

    componentDidMount() {
        if (undefined === this.props.deployments) {
            this.props.deploymentsModification(
                {
                    deployments: [],
                    selected: undefined,
                    runResults: {},
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

    onClickNew() {
        this.props.deploymentsModification({
            newDialogOpen: true,
        })
    }

    onClickDelete() {
        confirmAlert({
            title: 'Delete deployment?',                        // Title dialog
            message: 'Are you sure you wish to delete the deployment? There is no way to retrieve it',               // Message dialog
            childrenElement: () => {
            },       // Custom UI or Component
            confirmLabel: 'Yes, delete.',                           // Text button confirm
            cancelLabel: 'No.',                             // Text button cancel
            onConfirm: () => {
                const activeDeployment = this.activeDeployment();
                superagent.delete(this.props.login.endpoint + deploymentsEndpoint)
                    .set("api_key", this.props.login.token)
                    .query({"id": activeDeployment.id})
                    .end((err, res) => {
                        if (err || res.statusCode !== 200) {
                            return console.log(err);
                        }
                        console.log(res);
                        this.refreshDeployments();
                    });
            },
            onCancel: () => {
            },
        });
    }

    onClickRun() {
        const activeDeployment = this.activeDeployment();
        this.props.deploymentsModification({
            running: true,
        });
        superagent.post(this.props.login.endpoint + deploymentsRunEndpoint)
            .set("api_key", this.props.login.token)
            .send({
                deploymentID: activeDeployment.id,
                parameters: this.parameters.value,
                action: this.eventName.value,
                subject_table_name: this.subjectTable.value,
                subject_id: this.subjectID.value,
                predicate_table_name: this.predicateTable.value,
                predicate_id: this.predicateID.value,
            })
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    this.props.deploymentsModification({
                        running: false,
                    });
                    return console.log(err);
                }
                console.log(res);
                this.addOrUpdateDeployment(res.body.scriptDeployment, res.body, false);
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

    addOrUpdateDeployment(deployment, runResults = null, runningState = null) {
        var existing = this.props.deployments.deployments.find((element) => element.id === deployment.id);
        var newAllRunResults = {};
        newAllRunResults[deployment.id] = runResults;
        if (existing) {
            var existingIndex = this.props.deployments.deployments.indexOf(existing);
            var newDeployments = this.props.deployments.deployments.map((element, index) => {
                if (index === existingIndex) {
                    return deployment;
                } else {
                    return element;
                }
            });
            this.props.deploymentsModification({
                deployments: newDeployments,
                selected: deployment.id,
                runResults: Object.assign({}, this.props.deployments.runResults,
                    newAllRunResults),
                running: (null===runningState) ? this.props.deployments.running : runningState,
            })
        } else {
            this.props.deploymentsModification({
                deployments: this.props.deployments.deployments.concat([
                    Object.assign({}, deployment),
                ]),
                selected: deployment.id,
                runResults: Object.assign({}, this.props.deployments.runResults,
                    newAllRunResults),
            })
        }
    }

    saveNewDeployment(name, description, params) {
        const scriptID = this.props.script.id;
        superagent.post(this.props.login.endpoint + deploymentsEndpoint)
            .set("api_key", this.props.login.token)
            .query({parameters: params})
            .send({
                script_id: scriptID,
                name: name,
                description: description,
            })
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    console.log(res);
                    return console.log(err);
                }
                console.log(res);
                const runResult = res.body.scriptDeploymentRunResult;
                this.addOrUpdateDeployment(runResult.scriptDeployment, runResult);
            });
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
        var runResult = null;
        if (activeDeployment) {
            runResult = this.props.deployments.runResults[activeDeployment.id];
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
                    <p><b>stdout:</b></p>
                    <ul>
                        {
                            runResult ? runResult.stdout.split("\n").map(element => {
                                return <li>{element}</li>;
                            }) : null
                        }
                    </ul>
                    <p><b>stderr:</b></p>
                    <ul>
                        {
                            runResult ? runResult.stderr.split("\n").map(element => {
                                return <li>{element}</li>;
                            }) : null
                        }
                    </ul>
                    <p><b>Output:</b></p>
                    <ul>
                        {
                            runResult ? runResult.output.split("\n").map(element => {
                                return <li>{element}</li>;
                            }) : null
                        }
                    </ul>
                </div>);
        }
        const runConfig = (
            <div style={(this.props.deployments.showRunConfig) ? {} : {display: "none"}}>
                <b>Run Configuration:</b><br/>
                <label>Event Name:</label>
                <input
                    type="text"
                    placeholder="Enter event name"
                    defaultValue="run"
                    name="eventName"
                    ref={(input) => this.eventName = input}
                    required/>
                <label>Parameters:</label>
                <input
                    type="text"
                    placeholder="Enter parameters"
                    defaultValue="return 0"
                    name="parameters"
                    ref={(input) => this.parameters = input}
                    required/>
                <label>Subject Table:</label>
                <input
                    type="text"
                    placeholder="Enter subject table"
                    defaultValue=""
                    name="subjectTable"
                    ref={(input) => this.subjectTable = input}
                    required/>
                <label>Subject ID:</label>
                <input
                    type="text"
                    placeholder="Enter subject id"
                    defaultValue="0"
                    name="subjectID"
                    ref={(input) => this.subjectID = input}
                    required/>
                <label>Predicate Table:</label>
                <input
                    type="text"
                    placeholder="Enter predicate table"
                    defaultValue=""
                    name="predicateTable"
                    ref={(input) => this.predicateTable = input}
                    required/>
                <label>Predicate ID:</label>
                <input
                    type="text"
                    placeholder="Enter predicate id"
                    defaultValue="0"
                    name="predicateID"
                    ref={(input) => this.predicateID = input}
                    required/>
            </div>);
        return (
            <div
                align="left"
                className="deploymentEditorRoot"
                height="auto">
                <EditDeploymentModal
                    isOpen={this.props.deployments.newDialogOpen}
                    name=""
                    savePending={false}
                    save={(name, description, params) => {
                        console.log("Need to save new deployment: " + name + ", " + description + "," + params);
                        this.props.deploymentsModification({
                            newDialogOpen: false,
                        });
                        this.saveNewDeployment(name, description, params);
                    }}
                    cancel={() => {
                        this.props.updateScriptBrowser({
                            newDialogOpen: false,
                        });
                    }}
                />
                <div id="buttonDeploymentRow">
                    <button onClick={this.onClickNew}>New</button>
                    <button onClick={this.refreshDeployments}>Refresh all</button>
                    <button disabled="disabled">Refresh</button>
                    <button
                        disabled={activeDeployment && !this.props.deployments.running ? "" : "disabled"}
                            onClick={this.onClickRun}>Run</button>
                    <button onClick={this.toggleRunConfig}>Run config</button>
                    <button
                        disabled={activeDeployment && !this.props.deployments.running ? "" : "disabled"}
                            onClick={this.onClickDelete}>Delete</button>
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