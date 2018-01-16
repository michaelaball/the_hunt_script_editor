import React, {Component} from 'react';
import 'react-simpletabs/dist/react-simpletabs.css'
import './tabs-custom.css'
var Tabs = require('react-simpletabs');

class Editor extends Component {
    render () {
        return (
            <Tabs>
                <Tabs.Panel title='Tab #1'>
                    <h2>Content #1 here</h2>
                </Tabs.Panel>
                <Tabs.Panel title='Tab #2'>
                    <h2>Content #2 here</h2>
                </Tabs.Panel>
                <Tabs.Panel title='Tab #3'>
                    <h2>Content #3 here</h2>
                </Tabs.Panel>
            </Tabs>
        );
    }
}

export default Editor