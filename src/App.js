import React, {Component} from 'react';
import logo from './logo.svg';

import NavModule from './Nav.js';
import Footer from './Footer.js';
import ScriptBrowser from "./ScriptBrowser";
import User from "./User.js"
import TabbedEditor from "./TabbedEditor.js";

require ('codemirror/lib/codemirror.css');
require('./App.css');
const defaultEndpoint = "http://localhost:8080/api";
const superagent = require('superagent');

const scriptsEndpoint = "/scripts";



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
                newDialogOpen: false,
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
        this.updateTabbedEditor = this.updateTabbedEditor.bind(this);
        this.openTabForScript = this.openTabForScript.bind(this);
        this.switchEditorTab = this.switchEditorTab.bind(this);
        this.editorModification = this.editorModification.bind(this);
        this.refreshScripts = this.refreshScripts.bind(this);
        this.saveEditorScript = this.saveEditorScript.bind(this);
        this.saveNewScript = this.saveNewScript.bind(this);
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
                            newDialogOpen={this.state.scriptBrowser.newDialogOpen}
                            updateScripts={this.updateScripts}
                            updateScriptBrowser={this.updateScriptBrowser}
                            openTabForScript={this.openTabForScript}
                            refreshScripts={this.refreshScripts}
                            saveNewScript={this.saveNewScript}
                            login={this.state.login}/>
                    );
                    break;
                case "editor":
                    content = (
                        <TabbedEditor
                            scripts={this.state.scripts}
                            tabbedEditor={this.state.tabbedEditor}
                            switchEditorTab={this.switchEditorTab}
                            editorModification={this.editorModification}
                            saveEditorScript={this.saveEditorScript}
                            updateTabbedEditor={this.updateTabbedEditor}/>
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
            nav: Object.assign({}, this.state.nav, nav),
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
            login: login
        });
    }

    updateScripts(scripts) {
        this.setState({
            scripts: scripts,
            scriptBrowser: Object.assign({}, this.state.scriptBrowser, {
                codemirrorhack: this.state.scriptBrowser.codemirrorhack + 1,
            }),
        });
    }

    updateScriptBrowser(scriptBrowser) {
        this.setState({
            scriptBrowser: Object.assign({}, this.state.scriptBrowser, scriptBrowser),
        });
    }

    updateTabbedEditor(tabbedEditor) {
        this.setState({
            tabbedEditor: Object.assign({}, this.state.tabbedEditor, tabbedEditor),
        });
    }

    openTabForScript(script) {
        if (this.state.tabbedEditor.openTabs.find(element => element.id === script.id)) {
            this.updateTabbedEditor({
                activeTabID: script.id,
            });
        } else {
            this.updateTabbedEditor({
                activeTabID: script.id,
                openTabs: this.state.tabbedEditor.openTabs.concat([
                    Object.assign({}, script, {
                        infoDialogOpen: false,
                        modified: false,
                        saving: false,
                        codemirrorhack: 0,
                    })
                ])
            });
        }
        this.updateNav({
            activeTab: "editor",
        });
    }

    switchEditorTab(script) {
        this.updateTabbedEditor({
            activeTabID: script.id,
        });
    }

    editorModification(script) {
        console.log("editor modification"+script);
        this.updateTabbedEditor({
            openTabs: this.state.tabbedEditor.openTabs.map(element => {
                if (element.id === script.id) {
                    console.log("editor modification, found the tab: "+script);
                    return Object.assign({}, element, script);
                } else {
                    return element;
                }
            })
        });
    }

    refreshScripts() {
        superagent.get(this.state.login.endpoint + scriptsEndpoint)
            .set("api_key", this.state.login.token)
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    this.updateScripts([]);
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
                this.updateScripts(data);
            });
    }

    saveNewScript(script) {
        superagent.post(this.state.login.endpoint + scriptsEndpoint)
            .set("api_key", this.state.login.token)
            .send({
                name: script.name,
                ownerID: this.state.user.id,
                description: script.description,
                source: script.source,
            })
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    console.log(err);
                    alert("Could not able to save new script!");
                    return;
                }
                console.log(res);
                this.setState({
                    scripts: this.state.scripts.concat([res.body]),
                    tabbedEditor: {
                        activeTabID: script.id,
                        openTabs: this.state.tabbedEditor.openTabs.concat([
                            Object.assign({}, res.body, {
                                infoDialogOpen: false,
                                modified: false,
                                saving: false,
                            })
                        ])
                    },
                    nav: {
                        activeTab: "editor",
                    },
                });
            });
    }

    saveEditorScript(script) {
        this.editorModification({
            id: script.id,
            saving: true,
        });
        superagent.post(this.state.login.endpoint + scriptsEndpoint)
            .set("api_key", this.state.login.token)
            .send({
                id: script.id,
                name: script.name,
                ownerID: script.ownerID,
                description: script.description,
                source: script.source,
            })
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    this.editorModification({
                        id: script.id,
                        saving: false,
                    });
                    return console.log(err);
                }
                console.log(res);
                this.editorModification({
                    id: script.id,
                    saving: false,
                    modified: false,
                });
                this.refreshScripts();
            });
    }
}

export default App;
