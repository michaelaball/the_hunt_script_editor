import React, {Component} from 'react';

import './ScriptDetail.css';

var Codemirror = require('react-codemirror');

require('codemirror/lib/codemirror.css');

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
        return (
            <div class="scriptdetail" align="left">
                <Codemirror
                    ref="editor"
                    key={this.props.codemirrorhack}
                    value={this.props.script.source}
                    onChange={(code)=>this.props.editorModification(Object.assign({}, this.props.script, {
                        source: code,
                    }))}
                    options={options}
                    autoFocus={true} />
            </div>
        );
    }
}

export default Editor