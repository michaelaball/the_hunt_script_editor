import React, {Component} from 'react';

const superagent = require('superagent');

const defaultEndpoint = "http://localhost:8080/api";
const loginEndpoint = "/login/facebook/dialog";
const meEndpoint = "/users/me";

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

export default LoginModule