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
                <h2>{this.props.name}</h2>
                <div align="left">
                    <p><b>Owner:</b> Michael Ball</p>
                    <p><b>Description:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p><b>Source:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        );
    }

}

export default ScriptDetail