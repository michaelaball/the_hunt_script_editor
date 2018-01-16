import React, {Component} from 'react';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Editor from "./Editor";

class TabbedEditor extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        var selectedIndex = this.props.tabbedEditor.openTabs.indexOf(
            this.props.tabbedEditor.openTabs.find((element) => element.id === this.props.tabbedEditor.activeTabID)
        );
        return (
            <Tabs
                selectedIndex={selectedIndex}
                onSelect={tabIndex => this.props.switchEditorTab(this.props.tabbedEditor.openTabs[tabIndex])}>
                <TabList>
                    {this.props.tabbedEditor.openTabs.map((script, index) => {
                        return (<Tab>{script.name + " ("+script.id+")"}</Tab>)
                    })}
                </TabList>
                {this.props.tabbedEditor.openTabs.map((script, index) => {
                    return (
                        <TabPanel>
                            <Editor
                                codemirrorhack={0}
                                script={script}
                            />
                        </TabPanel>
                    )
                })}
            </Tabs>
        );
    }
}

export default TabbedEditor