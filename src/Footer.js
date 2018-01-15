import React, {Component} from 'react';

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

export default Footer