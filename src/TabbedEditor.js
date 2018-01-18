import React, {Component} from 'react';
import 'react-tabs/style/react-tabs.css';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import Editor from "./Editor";

class TabbedEditor extends Component {
    constructor(props) {
        super(props);
        this.activeTab = this.activeTab.bind(this);
        this.activeTabIndex = this.activeTabIndex.bind(this);
        this.onClickInfo = this.onClickInfo.bind(this);
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickRevert = this.onClickRevert.bind(this);
        this.doCloseTab = this.doCloseTab.bind(this);
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

    onClickRevert() {
        confirmAlert({
            title: 'Revert changes to script',                        // Title dialog
            message: 'Are you sure you wish to revert to the last save?',               // Message dialog
            childrenElement: () => {},       // Custom UI or Component
            confirmLabel: 'Confirm',                           // Text button confirm
            cancelLabel: 'Cancel',                             // Text button cancel
            onConfirm: () => {
                var activeTab = this.activeTab();
                var activeTabID = this.props.tabbedEditor.activeTabID;
                var unmodifiedScript = this.props.scripts.find((element) => element.id === activeTabID);
                this.props.editorModification(Object.assign({}, unmodifiedScript, {
                    codemirrorhack: activeTab.codemirrorhack+1,
                    infoDialogOpen: false,
                    modified: false,
                    saving: false,
                }));
            },    // Action after Confirm
            onCancel: () => {},      // Action after Cancel
        });
    }

    onClickClose() {
        if (this.activeTab().modified) {
            confirmAlert({
                title: 'Unsaved changes',                        // Title dialog
                message: 'Are you sure you wish to close the tab without saving? Changes will be lost.',               // Message dialog
                childrenElement: () => {},       // Custom UI or Component
                confirmLabel: 'Close',                           // Text button confirm
                cancelLabel: 'Cancel',                             // Text button cancel
                onConfirm: () => {
                    this.doCloseTab();
                },    // Action after Confirm
                onCancel: () => {},      // Action after Cancel
            });
        } else {
            this.doCloseTab();
        }
    }

    doCloseTab() {
        var newActiveTab = null;
        const activeTab = this.activeTab();
        const newOpenTabs = this.props.tabbedEditor.openTabs.filter(element => {
            if (activeTab.id === element.id) {
                // remove
                return false;
            } else {
                newActiveTab = element;
                return true;
            }
        });
        this.props.updateTabbedEditor({
            openTabs: newOpenTabs,
            activeTabID: null===newActiveTab ? null : newActiveTab.id,
        });
    }

    render() {
        var selectedIndex = this.activeTabIndex();
        console.log("active tab:"+this.activeTab());
        return (
            <div align="left">
                <div>
                    <button
                        onClick={this.onClickInfo}
                        disabled={this.activeTab()===undefined ? "disabled" : null}>Info</button>
                    <button
                        disabled={this.activeTab()===undefined ? "disabled" : null}>Deployments</button>
                    <button
                        disabled={this.activeTab()===undefined ? "disabled" : null}>Run</button>
                    <button
                        onClick={() => this.props.saveEditorScript(this.activeTab())}
                        disabled={this.activeTab()===undefined || !this.activeTab().modified ? "disabled" : null}>Save</button>
                    <button
                        onClick={this.onClickRevert}
                        disabled={this.activeTab()===undefined || !this.activeTab().modified ? "disabled" : null}>Revert</button>
                    <button
                        onClick={this.onClickClose}
                        disabled={this.activeTab()===undefined ? "disabled" : null}>Close</button>
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