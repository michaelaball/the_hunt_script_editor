import React, {Component} from 'react';
import './ScriptDetail.css';

import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css'

const ReactTable = require('react-table').default;
const TableSelect = require('react-table-select');
const CheckboxTable = checkboxHOC(ReactTable);

const superagent = require('superagent');

const scriptsEndpoint = "/scripts";

class ScriptDetail extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="scriptdetail">
                <h2>{this.props.script.name}</h2>
                <div align="left">
                    <p><b>Owner:</b> {this.props.script.ownerID}</p>
                    <p><b>Description:</b> {this.props.script.description}</p>
                    <p><b>Source:</b> {this.props.script.source}</p>
                </div>
            </div>
        );
    }

}

export default ScriptDetail