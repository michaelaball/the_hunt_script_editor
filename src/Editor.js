import React, {Component} from 'react';
import EditInfoModal from "./EditInfoModal";

import './ScriptDetail.css';

var Codemirror = require('react-codemirror');



require('codemirror/mode/lua/lua');

class Editor extends Component {
    constructor (props) {
        super(props);
    }

    onSourceModified() {

    }

    render() {
        var options = {
            lineWrapping: false,
            lineNumbers: true,
            mode: 'lua',
        };
        if (this.props.enabled) {
            return (
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
                        onChange={(code)=>this.props.editorModification({
                            id: this.props.script.id,
                            source: code,
                            modified: true,
                            codemirrorhack: this.props.script.codemirrorhack,
                        })}
                        options={options}
                        autoFocus={true} />
                </div>
            );
        } else {
            return null;
        }

    }
}

export default Editor