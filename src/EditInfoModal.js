import React, {Component} from 'react';

import ReactModal from 'react-modal';

class EditInfoModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactModal
                isOpen={this.props.isOpen}>
                <div class="container">
                    <label><b>Name:</b></label>
                    <input
                        type="text"
                        placeholder="Enter script name"
                        defaultValue={this.props.name}
                        name="uname"
                        ref={(input) => this.nameInput = input}
                        required/>
                    <label><b>Description:</b></label>
                    <input
                        type="text"
                        placeholder="Description"
                        defaultValue={this.props.description}
                        name="token"
                        ref={(input) => this.descriptionInput = input}
                        disabled={this.props.savePending ? "disabled" : ""}
                        required/>
                    <button
                        type="button"
                        onClick={() => this.props.save(this.nameInput.value, this.descriptionInput.value)}>
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={this.props.cancel}>
                        Cancel
                    </button>

                </div>
            </ReactModal>
        );
    }
}

export default EditInfoModal