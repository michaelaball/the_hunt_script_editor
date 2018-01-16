import React, {Component} from 'react';

import './ScriptDetail.css';

var Codemirror = require('react-codemirror');

require('codemirror/lib/codemirror.css');

require('codemirror/mode/lua/lua');

class Editor extends Component {
    constructor (props) {
        super(props);
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
                    onChange={this.updateCode}
                    options={options}
                    autoFocus={true} />
            </div>
        );
    }
}

export default Editor