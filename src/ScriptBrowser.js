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
        this.getColumns = this.getColumns.bind(this);

        this.onClickNew = this.onClickNew.bind(this);
        this.onClickEdit = this.onClickEdit.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickRefresh = this.onClickRefresh.bind(this);
        this.props.refreshScripts();
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



    isSelected = (key) => {
        return this.props.scriptBrowser.selectedKey === key;
    };

    toggleSelection = (key, shift, row) => {
        this.props.updateScriptBrowser(
            Object.assign({}, this.props.scriptBrowser, {
                selectedKey: key,
                codemirrorhack: this.props.scriptBrowser.codemirrorhack+1,
            })
        );
    };


    onClickNew() {

    }

    onClickEdit() {
        var script = this.props.scripts.find(script => script.id === this.props.scriptBrowser.selectedKey);
        console.log("trying to open tab for: "+script);
        this.props.openTabForScript(script);
    }

    onClickDelete() {
        const deleteID = this.props.scriptBrowser.selectedKey;
        superagent.delete(this.props.login.endpoint + scriptsEndpoint)
            .set("api_key", this.props.login.token)
            .query({id: deleteID})
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    return console.log(err);
                }
                console.log(res);
                const data = this.props.scripts.filter(script => script.id !== deleteID);
                this.props.updateScriptBrowser({
                    selectedKey: null,
                });
                this.props.updateScripts(data);
            });
    }

    onClickRefresh() {
        this.props.refreshScripts();
    }

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
                codemirrorhack={this.props.scriptBrowser.codemirrorhack}
            />;
        console.log("script: "+script);

        return (
            <div style={{height: '100%'}}>
                <div style={{width: '100%'}}>
                    <div style={{float: 'left', width: '60%', marginBottom: '60px'}}>
                        <div align="left">
                            <button onClick={this.onClickNew}>New</button>
                            <button onClick={this.onClickEdit} disabled={this.props.scriptBrowser.selectedKey===null ? "disabled" : null}>Edit</button>
                            <button onClick={this.onClickDelete} disabled={this.props.scriptBrowser.selectedKey===null ? "disabled" : null}>Delete</button>
                            <button onClick={this.onClickRefresh}>Refresh</button>
                        </div>
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