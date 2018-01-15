import React, {Component} from 'react';

class User extends Component {
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

export default User