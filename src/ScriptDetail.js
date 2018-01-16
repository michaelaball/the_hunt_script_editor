import React, {Component} from 'react';
import './ScriptDetail.css';

import 'react-table/react-table.css'

var Codemirror = require('react-codemirror');

require('codemirror/lib/codemirror.css');

require('codemirror/mode/lua/lua');

class ScriptDetail extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var options = {
            lineWrapping: true,
            lineNumbers: true,
            readOnly: true,
            mode: 'lua',
        };
        return (
            <div class="scriptdetail">
                <h2>{this.props.script.name}</h2>
                <div align="left">
                    <p><b>ID:</b> {this.props.script.id}</p>
                    <p><b>Owner:</b> {this.props.script.ownerID}</p>
                    <p><b>Description:</b> {this.props.script.description}</p>
                    <p><b>Source:</b></p>
                    <p><Codemirror ref="editor" key={this.props.codemirrorhack}
                        value={this.props.script.source} onChange={this.updateCode} options={options} autoFocus={true} /></p>
                </div>
            </div>
        );
    }

}

export default ScriptDetail