import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css'

import NavModule from './Nav.js';
import Footer from './Footer.js';
import ScriptBrowser from "./ScriptBrowser";
import User from "./User.js"

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
        }
        this.updateNav = this.updateNav.bind(this);
        this.updateLogin = this.updateLogin.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateScripts = this.updateScripts.bind(this);
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
                            updateScripts={this.updateScripts}
                            login={this.state.login}/>
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
}

export default App;
