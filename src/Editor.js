import React, {Component} from 'react';
import EditInfoModal from "./EditInfoModal";
import DeploymentEditor from "./DeploymentEditor";
import SplitPane from 'react-split-pane';

import './ScriptDetail.css';

var Codemirror = require('react-codemirror');


require('codemirror/mode/lua/lua');

class Editor extends Component {
    constructor(props) {
        super(props);
        this.deploymentsModification = this.deploymentsModification.bind(this);
    }

    onSourceModified() {

    }

    deploymentsModification(deployments) {
        this.props.editorModification({
            deployments: Object.assign({}, this.props.script.deployments, deployments),
        })
    }

    render() {
        var options = {
            lineWrapping: false,
            lineNumbers: true,
            mode: 'lua',
        };
        var editor = (
            <div align="left" className="editor">
                <EditInfoModal
                    isOpen={this.props.script.infoDialogOpen}
                    name={this.props.script.name}
                    description={this.props.script.description}
                    savePending={false}
                    save={(name, description) => {
                        this.props.editorModification({
                            id: this.props.script.id,
                            name: name,
                            description: description,
                            modified: true,
                            infoDialogOpen: false,
                        });
                    }}
                    cancel={() => {
                        this.props.editorModification({
                            id: this.props.script.id,
                            infoDialogOpen: false,
                        });
                    }}
                />
                <Codemirror
                    ref="editor"
                    key={this.props.script.codemirrorhack}
                    value={this.props.script.source}
                    onChange={(code) => this.props.editorModification({
                        id: this.props.script.id,
                        source: code,
                        modified: true,
                        codemirrorhack: this.props.script.codemirrorhack,
                    })}
                    options={options}
                    autoFocus={true}/>
            </div>);
        if (this.props.script.deploymentsPaneOpen) {
            return (
                <SplitPane id="myPane1Bitch"
                           split="vertical"
                           style={{
                               overflowY: "hidden",
                               height: "auto",
                               position: "auto",
                               flex: "1 1 auto",
                               display: "flex",
                               flexFlow: "column",
                           }}
                           pane1Style={{
                               overflowY: "hidden",
                               flex: "1 1 auto",
                               display: "flex",
                               flexFlow: "column",
                           }}
                           minSize={50}
                           defaultSize={this.props.script.splitPos ? this.props.script.splitPos : 400}
                           onChange={(size) => {
                               this.props.editorModification({
                                   splitPos: size,
                               });
                           }}>
                    {editor}
                    <div>
                        <DeploymentEditor
                            deployments={this.props.script.deployments}
                            deploymentsModification={this.deploymentsModification}/>
                    </div>
                </SplitPane>
            )
        }
        return (
            editor
        );


    }
}

export default Editor