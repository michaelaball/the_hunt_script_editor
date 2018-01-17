import React, {Component} from 'react';
import 'react-tabs/style/react-tabs.css';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Editor from "./Editor";

class TabbedEditor extends Component {
    constructor(props) {
        super(props);
        this.activeTab = this.activeTab.bind(this);
        this.activeTabIndex = this.activeTabIndex.bind(this);
        this.onClickInfo = this.onClickInfo.bind(this);
    }

    activeTab() {
        return this.props.tabbedEditor.openTabs.find((element) => element.id === this.props.tabbedEditor.activeTabID)
    }

    activeTabIndex() {
        return this.props.tabbedEditor.openTabs.indexOf(this.activeTab());
    }

    onClickInfo() {
        this.props.editorModification({
            id: this.activeTab().id,
            infoDialogOpen: true,
        });
    }

    render() {
        var selectedIndex = this.activeTabIndex();
        return (
            <div align="left">
                <div>
                    <button onClick={this.onClickInfo}>Info</button>
                    <button>Deployments</button>
                    <button>Run</button>
                    <button>Save</button>
                    <button>Revert</button>
                    <button>Close</button>
                </div>
                <Tabs
                    selectedIndex={selectedIndex}
                    onSelect={tabIndex => this.props.switchEditorTab(this.props.tabbedEditor.openTabs[tabIndex])}>
                    <TabList>
                        {this.props.tabbedEditor.openTabs.map((script, index) => {
                            if (script.modified) {
                                return (<Tab><b>{script.name + " (" + script.id + ")"}</b></Tab>)
                            } else {
                                return (<Tab>{script.name + " (" + script.id + ")"}</Tab>)
                            }
                        })}
                    </TabList>
                    {this.props.tabbedEditor.openTabs.map((script, index) => {
                        return (
                            <TabPanel>
                                <Editor
                                    codemirrorhack={0}
                                    script={script}
                                    editorModification={this.props.editorModification}
                                />
                            </TabPanel>
                        )
                    })}
                </Tabs>
            </div>
        );
    }
}

export default TabbedEditor