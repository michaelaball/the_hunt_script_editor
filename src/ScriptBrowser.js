import React, {Component} from 'react';

import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css'
import ScriptDetail from "./ScriptDetail";

const ReactTable = require('react-table').default;
const TableSelect = require('react-table-select');
const CheckboxTable = checkboxHOC(ReactTable);

const superagent = require('superagent');

const scriptsEndpoint = "/scripts";

class ScriptBrowser extends Component {
    constructor(props) {
        super(props);
        this.refreshScripts = this.refreshScripts.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.refreshScripts()
    }


    getColumns() {
        const sample = {
            id: null,
            ownerID: null,
            name: null,
        };
        const columns = [];
        Object.keys(sample).forEach((key) => {
            if (key !== '_id') {
                columns.push({
                    accessor: key,
                    Header: key,
                })
            }
        })
        return columns;
    }

    refreshScripts() {
        superagent.get(this.props.login.endpoint + scriptsEndpoint)
            .set("api_key", this.props.login.token)
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    this.props.updateScripts([]);
                    return console.log(err);
                }
                console.log(res);
                const data = res.body.map((item) => {
                    const _id = item.id;
                    return {
                        _id,
                        ...item,
                    }
                });
                this.props.updateScripts(data);
            });
    }

    isSelected = (key) => {
        return this.props.scriptBrowser.selectedKey === key;
    };

    toggleSelection = (key, shift, row) => {
        this.props.updateScriptBrowser(
            Object.assign({}, this.props.scriptBrowser, {
                selectedKey: key,
            })
        );
    };

    render() {
        const {toggleSelection, toggleAll, isSelected, logSelection} = this;
        const checkboxProps = {
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'radio',
        };
        const script=this.props.scripts.find((element) => {
            return element.id === this.props.scriptBrowser.selectedKey
        });
        const scriptDetail = (script === undefined) ? null :
            <ScriptDetail
                script={script}
            />;
        console.log("script: "+script);

        return (
            <div style={{height: '100%'}}>
                <div style={{width: '100%'}}>
                    <div style={{float: 'left', width: '60%', marginBottom: '60px'}}>
                        <CheckboxTable
                            ref={(r) => this.checkboxTable = r}
                            style={{height: '100%'}}
                            data={this.props.scripts}
                            columns={this.getColumns(this.props.scripts)}
                            defaultPageSize={20}
                            className="-striped -highlight"
                            {...checkboxProps}/>
                    </div>
                    <div style={{float: 'right', width: '40%'}}>
                        {scriptDetail}
                    </div>
                </div>

            </div>
        );
    }

}

export default ScriptBrowser