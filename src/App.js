import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const superagent = require('superagent');

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

    updateLogin(login) {
        console.log(login);
        this.setState({
            login
        });
    }
}

class NavModule extends Component {

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
        this.props.updateLogin(Object.assign({}, this.props.login, {
            endpoint: this.endpoint.value,
            token: this.token.value,
            trying: true,
            loggedIn: false,
        }));

        superagent.get(this.endpoint.value + meEndpoint)
            .set("api_key", this.token.value)
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    return console.log(err);
                }
                console.log(res);
                this.props.updateUser(res.body);
                this.props.updateLogin(Object.assign({}, this.props.login, {
                    loggedIn: true,
                    trying: false,
                }));
            });
    }

    render() {
        return (
            <div>
                <p className="App-intro">
                    To get started, enter the server information you wish to login to:
                </p>

                <div id="id01" class="modal">
                    <form class="modal-content animate">
                        <div class="container">
                            <h2>
                                <a href="https://www.facebook.com/dialog/oauth?client_id=126632311262559&redirect_uri=http%3A%2F%2Fthehunt.circledig.com%2Fapi%2Flogin%2Ffacebook&scope=public_profile%2Cuser_status%2Cuser_about_me%2Cuser_birthday%2Cuser_friends" target="_app">
                                Click to get token</a></h2>
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
