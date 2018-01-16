import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import NavModule from './Nav.js';
import Footer from './Footer.js';
import ScriptBrowser from "./ScriptBrowser";
import User from "./User.js"
import TabbedEditor from "./TabbedEditor.js";

const defaultEndpoint = "http://localhost:8080/api";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nav: {
                activeTab: "profile",
            },
            login: {
                endpoint: defaultEndpoint,
                token: null,
                logginIn: false,
                trying: false,
            },
            user: null,
            scripts: [],
            scriptBrowser: {
                selectedKey: null,
                selectedID: null,
                codemirrorhack: 0,
            },
            tabbedEditor: {
                openTabs: [],
            },
        }
        this.updateNav = this.updateNav.bind(this);
        this.updateLogin = this.updateLogin.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateScripts = this.updateScripts.bind(this);
        this.updateScriptBrowser = this.updateScriptBrowser.bind(this);
        this.openTabForScript = this.openTabForScript.bind(this);
        this.switchEditorTab = this.switchEditorTab.bind(this);
        this.editorModification = this.editorModification.bind(this);
    }

    render() {
        var content = null;
        if (this.state.login.loggedIn) {
            switch (this.state.nav.activeTab) {
                case "profile":
                    content = (
                        <User
                            user={this.state.user}/>
                    );
                    break;
                case "scripts":
                    content = (
                        <ScriptBrowser
                            scripts={this.state.scripts}
                            scriptBrowser={this.state.scriptBrowser}
                            updateScripts={this.updateScripts}
                            updateScriptBrowser={this.updateScriptBrowser}
                            openTabForScript={this.openTabForScript}
                            login={this.state.login}/>
                    );
                    break;
                case "editor":
                    content = (
                        <TabbedEditor
                            tabbedEditor={this.state.tabbedEditor}
                            switchEditorTab={this.switchEditorTab}
                            editorModification={this.editorModification}/>
                    );
                    break;
            }
        }
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to The Hunt Lua Script Editor</h1>
                </header>
                <div className="NavModule">
                    <NavModule
                        nav={this.state.nav}
                        login={this.state.login}
                        updateNav={this.updateNav}
                        updateLogin={this.updateLogin}
                        updateUser={this.updateUser}/>

                </div>
                <div className="content">{content}</div>
                <Footer
                    login={this.state.login}
                    user={this.state.user}/>
            </div>
        );
    }

    updateNav(nav) {
        this.setState({
            nav
        });
    }

    updateUser(user) {
        this.setState({
            user: user,
        })
    }

    updateLogin(login) {
        console.log(login);
        this.setState({
            login
        });
    }

    updateScripts(scripts) {
        this.setState({
            scripts: scripts,
        });
    }

    updateScriptBrowser(scriptBrowser) {
        this.setState({
            scriptBrowser,
        });
    }

    openTabForScript(script) {
        if (this.state.tabbedEditor.openTabs.find(element => element.id === script.id)) {
            this.setState({
                nav: Object.assign({}, this.state.nav, {
                    activeTab: "editor",
                }),
                tabbedEditor: Object.assign({}, this.state.tabbedEditor, {
                    activeTabID: script.id,
                })
            });
        } else {
            this.setState({
                nav: Object.assign({}, this.state.nav, {
                    activeTab: "editor",
                }),
                tabbedEditor: Object.assign({}, this.state.tabbedEditor, {
                    activeTabID: script.id,
                    openTabs: this.state.tabbedEditor.openTabs.concat([
                        Object.assign({}, script, {
                            modified: false,
                            saving: false,
                        })
                    ])
                })
            });
        }
    }

    switchEditorTab(script) {
        this.setState({
            tabbedEditor: Object.assign({}, this.state.tabbedEditor, {
                activeTabID: script.id,
            })
        });
    }

    editorModification(script) {
        const tabbedEditor = this.state.tabbedEditor;
        const scripts = tabbedEditor.openTabs;
        const newTabbedEditor = Object.assign({}, tabbedEditor, {openTabs: scripts.map(element => {
            if (element.id === script.id) {
                return Object.assign({}, script);
            } else {
                return element;
            }
        })});
        this.setState({
            tabbedEditor: newTabbedEditor,
        });
    }
}

export default App;
