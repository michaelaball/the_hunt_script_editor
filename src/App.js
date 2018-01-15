import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css'

const ReactTable = require('react-table').default;
const TableSelect = require('react-table-select');


const CheckboxTable = checkboxHOC(ReactTable);

const superagent = require('superagent');

const defaultEndpoint = "http://localhost:8080/api";
const loginEndpoint = "/login/facebook/dialog";
const meEndpoint = "/users/me";
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
        }
        this.updateNav = this.updateNav.bind(this);
        this.updateLogin = this.updateLogin.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateScripts = this.updateScripts.bind(this);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to The Hunt Lua Script Editor</h1>
                </header>
                <NavModule
                    nav={this.state.nav}
                    login={this.state.login}
                    user={this.state.user}
                    scripts={this.state.scripts}
                    updateNav={this.updateNav}
                    updateLogin={this.updateLogin}
                    updateUser={this.updateUser}
                    updateScripts={this.updateScripts}/>
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

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.login.loggedIn) {
            return (
                <div class="footer">
                    <p>You are logged in to <a href={this.props.login.endpoint}
                                               target="_app">{this.props.login.endpoint}</a>
                        &nbsp;
                        as {this.props.user.first_name + " " + this.props.user.last_name + " (" + this.props.user.id + ")"}.
                    </p>
                </div>
            );
        } else {
            return null;
        }
    }
}

class UserComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div id="id01" class="modal">
                    <div class="container">
                        <p className="App-intro">
                            <img src={this.props.user.image_url}/>
                        </p>
                        <h3><b>id:</b> {this.props.user.id}</h3>
                        <h3><b>Name: </b>{this.props.user.first_name} {this.props.user.last_name}</h3>
                        <h3><b>Birthday: </b>{this.props.user.birthday}</h3>
                        <h3><b>Bio: </b>{this.props.user.bio}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

class NavModule extends Component {

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
                    this.props.updateUser(null);
                    this.props.updateLogin(Object.assign({}, this.props.login, {
                        loggedIn: false,
                        trying: false,
                    }));
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
                                <a href="https://www.facebook.com/dialog/oauth?client_id=126632311262559&redirect_uri=http%3A%2F%2Fthehunt.circledig.com%2Fapi%2Flogin%2Ffacebook&scope=public_profile%2Cuser_status%2Cuser_about_me%2Cuser_birthday%2Cuser_friends"
                                   target="_app">
                                    Click to get token</a></h2>
                            <label><b>API Endpoint</b></label>
                            <input
                                type="text"
                                placeholder="Enter API Endpoint"
                                defaultValue={this.props.login.endpoint}
                                name="uname"
                                ref={(input) => this.endpoint = input}
                                disabled={this.props.login.trying ? "disabled" : ""}
                                required/>
                            <label><b>Token</b></label>
                            <input
                                type="text"
                                placeholder="Enter Token"
                                defaultValue={this.props.login.token}
                                name="token"
                                ref={(input) => this.token = input}
                                disabled={this.props.login.trying ? "disabled" : ""}
                                required/>
                            <button
                                type="button"
                                onClick={this.loginWithToken}
                                disabled={this.props.login.trying ? "disabled" : ""}>
                                Login with Token
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

class ScriptBrowser extends Component {
    constructor(props) {
        super(props);
        this.refreshScripts = this.refreshScripts.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.refreshScripts()
    }


    getColumns(data)
    {
        const columns = [];
        if (data.length === 0 ) {
            return columns;
        }
        const sample = data[0];
        Object.keys(sample).forEach((key)=>{
            if(key!=='_id')
            {
                columns.push({
                    accessor: key,
                    Header: key,
                })
            }
        })
        return columns;
    }

    refreshScripts() {
        superagent.get(this.props.login.endpoint + scriptsEndpoint)
            .set("api_key", this.props.login.token)
            .end((err, res) => {
                if (err || res.statusCode !== 200) {
                    this.props.updateScripts([]);
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
                this.props.updateScripts(data);
            });
    }

    render() {
        const { toggleSelection, toggleAll, isSelected, logSelection } = this;
        const checkboxProps = {
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: 'checkbox',
        };
        return (
            <div>
                <table>
                    <tr>
                        <td>id</td>
                        <td>name</td>
                    </tr>
                    {this.props.scripts.map((item, index) => (
                        <tr>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </table>
                <CheckboxTable
                    ref={(r)=>this.checkboxTable=r}
                    data={this.props.scripts}
                    columns={this.getColumns(this.props.scripts)}
                    defaultPageSize={10}
                    className="-striped -highlight"

                    {...checkboxProps}/>
            </div>
        );
    }

}

export default App;
