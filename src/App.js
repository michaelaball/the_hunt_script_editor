import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const request = require('request');
const defaultEndpoint = "http://localhost:8080/api";
const loginEndpoint = "/login/facebook/dialog";
const meEndpoint = "/users/me";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: {
                endpoint: defaultEndpoint,
                token: null,
                logginIn: false,
                trying: false,
            },
            user: null,
        }
        this.updateLogin = this.updateLogin.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to The Hunt Lua Script Editor</h1>
                </header>
                <NavModule
                    login={this.state.login}
                    updateLogin={this.updateLogin}
                    updateUser={this.updateUser}/>
            </div>
        );
    }

    updateUser(user) {
        this.setState({
            user: user,
        })
    }

    updateLogin(endpoint, newToken, loggedIn, trying) {
        this.setState({
            login: {
                endpoint: endpoint,
                token: newToken,
                logginIn: loggedIn,
                trying: trying,
            }
        });
    }
}

class NavModule extends Component {

    constructor(props) {
        super(props);
        this.onClickLogout = this.onClickLogout.bind(this);
    }

    onClickLogout() {
        this.props.updateLogin(this.props.login.endpoint, null, false, false);
    }

    render() {
        if (this.props.login.logginIn) {
            return (
                <div className="NavModule">
                    <div class="topnav">
                        <a class="active" href="#news">Scripts</a>
                        <a href="#contact" onClick={this.onClickLogout}>Logout</a>
                    </div>
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

class LoginModule extends Component {

    constructor(props) {
        super(props);
        this.loginWithToken = this.loginWithToken.bind(this);
    }

    loginWithToken() {
        //this.props.updateLogin(this.input.value, null, true);
        this.props.updateLogin(this.endpoint.value, this.token.value, false, true);
        var options = {
            url: this.endpoint.value + meEndpoint,
            headers: {
                api_key: this.token.value,
            },
            json: true,
        }
        request(options,
            (err, res, body) => {
            if (err || res.statusCode !== 200) {
                return console.log(err);
            }
            console.log(res);
            this.props.updateUser(res.body);
            this.props.updateLogin(this.props.login.endpoint, this.props.login.token, true, false);
        });
    }
    // loginWithFacebook() {
    //     var options = {
    //         url: this.props.login.endpoint + loginEndpoint,
    //         headers: {},
    //         json: true,
    //     }
    //     request(options,
    //         (err, res, body) => {
    //             if (err || res.statusCode !== 200) {
    //                 return console.log(err);
    //             }
    //             console.log(res);
    //             var options = {
    //                 url: res.body.message,
    //                 headers: {},
    //                 json: true,
    //             }
    //             request(options,
    //                 (err, res, body) => {
    //                     if (err || res.statusCode !== 200) {
    //                         return console.log(err);
    //                     }
    //                     console.log(res);
    //                 });
    //         });
    //}

    render() {
        return (
            <div>
                <p className="App-intro">
                    To get started, enter the server information you wish to login to:
                </p>

                <div id="id01" class="modal">
                    <form class="modal-content animate">
                        <div class="container">
                            <label><b>API Endpoint</b></label>
                            <input
                                type="text"
                                placeholder="Enter API Endpoint"
                                defaultValue={this.props.login.endpoint}
                                name="uname"
                                ref={(input) => this.endpoint = input}
                                   required/>
                            <label><b>Token</b></label>
                            <input
                                type="text"
                                placeholder="Enter Token"
                                defaultValue={this.props.login.token}
                                name="token"
                                ref={(input) => this.token = input}
                                required/>
                            <button type="button" onClick={this.loginWithToken}>Login with Token</button>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
