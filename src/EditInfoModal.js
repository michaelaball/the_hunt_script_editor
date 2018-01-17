import React, {Component} from 'react';

import ReactModal from 'react-modal';

class EditInfoModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactModal
                isOpen={this.props.script.modif}>
                <div class="container">
                    <label><b>Name:</b></label>
                    <input
                        type="text"
                        placeholder="Enter script name"
                        defaultValue={this.props.login.endpoint}
                        name="uname"
                        ref={(input) => this.name = input}
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
                        className="loginButton"
                        type="button"
                        onClick={this.loginWithToken}
                        disabled={this.props.login.trying ? "disabled" : ""}>
                        Login with Token
                    </button>

                </div>
            </ReactModal>
        );
    }
}

export default EditInfoModal