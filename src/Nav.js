import React, {Component} from 'react';
import LoginModule from './Login.js'

class Nav extends Component {

    constructor(props) {
        super(props);
        this.onClickLogout = this.onClickLogout.bind(this);
    }

    onClickLogout() {
        this.props.updateLogin(Object.assign({}, this.props.login, {
            token: null,
            loggedIn: false,
            trying: false,
        }));
        this.props.updateUser(null);
    }

    render() {
        if (this.props.login.loggedIn) {
            return (
                <div class="topnav">
                    <a class={this.props.nav.activeTab === "profile" ? "active" : ""}
                       onClick={() => {
                           this.props.updateNav(Object.assign({}, this.props.nav, {activeTab: "profile"}))
                       }}>Profile</a>
                    <a class={this.props.nav.activeTab === "scripts" ? "active" : ""}
                       onClick={() => {
                           this.props.updateNav(Object.assign({}, this.props.nav, {activeTab: "scripts"}))
                       }}>Scripts</a>
                    <a class={this.props.nav.activeTab === "editor" ? "active" : ""}
                       onClick={() => {
                           this.props.updateNav(Object.assign({}, this.props.nav, {activeTab: "editor"}))
                       }}>Editor</a>
                    <a href="#contact" onClick={this.onClickLogout}>Logout</a>
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