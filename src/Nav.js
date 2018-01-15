import React, {Component} from 'react';
import UserComponent from './User.js'
import LoginModule from './Login.js'
import ScriptBrowser from './ScriptBrowser.js'

class Nav extends Component {

    constructor(props) {
        super(props);
        this.onClickLogout = this.onClickLogout.bind(this);
        this.switchContainer = this.switchContainer.bind(this);
    }

    onClickLogout() {
        this.props.updateLogin(Object.assign({}, this.props.login, {
            token: null,
            loggedIn: false,
            trying: false,
        }));
        this.props.updateUser(null);
    }

    switchContainer() {
        switch (this.props.nav.activeTab) {
            case "profile":
                return (
                    <div className="content">
                        <UserComponent
                            user={this.props.user}/>
                    </div>
                );
            case "scripts":
                return <ScriptBrowser
                    scripts={this.props.scripts}
                    updateScripts={this.props.updateScripts}
                    login={this.props.login}/>
            default:
                return null;
        }
    }

    render() {
        if (this.props.login.loggedIn) {
            return (
                <div className="NavModule">
                    <div class="topnav">
                        <a class={this.props.nav.activeTab === "profile" ? "active" : ""}
                           onClick={() => {
                               this.props.updateNav(Object.assign({}, this.props.nav, {activeTab: "profile"}))
                           }}>Profile</a>
                        <a class={this.props.nav.activeTab === "scripts" ? "active" : ""}
                           onClick={() => {
                               this.props.updateNav(Object.assign({}, this.props.nav, {activeTab: "scripts"}))
                           }}>Scripts</a>
                        <a href="#contact" onClick={this.onClickLogout}>Logout</a>
                    </div>
                    {this.switchContainer()}
                </div>
            );
        } else {
            return (
                <LoginModule
                    login={this.props.login}
                    updateLogin={this.props.updateLogin}
                    updateUser={this.props.updateUser}/>
            );
        }
    }
}

export default Nav