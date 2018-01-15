import React, {Component} from 'react';

import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css'

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


    getColumns(data) {
        const columns = [];
        if (data.length === 0) {
            return columns;
        }
        const sample = data[0];
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

    render() {
        const {toggleSelection, toggleAll, isSelected, logSelection} = this;
        const checkboxProps = {
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        return (
            <div style={{height:'100%'}}>
                <div style={{width: '100%'}}>
                    <div style={{float: 'left', width: '60%'}}>
                        <CheckboxTable
                            ref={(r) => this.checkboxTable = r}
                            style={{height: '100%'}}
                            data={this.props.scripts}
                            columns={this.getColumns(this.props.scripts)}
                            defaultPageSize={10}
                            className="-striped -highlight"
                            {...checkboxProps}/>
                    </div>
                    <div style={{float: 'right'}}>

                    </div>
                </div>

            </div>
        );
    }

}

export default ScriptBrowser