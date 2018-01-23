import React, {Component} from 'react';

import ReactModal from 'react-modal';

class EditDeploymentModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var modalStyles = {overlay: {zIndex: 30}};
        return (
            <ReactModal
                style={ modalStyles }
                isOpen={this.props.isOpen}>
                <div>
                    <label><b>Name:</b></label>
                    <input
                        type="text"
                        placeholder="Enter deployment name"
                        defaultValue={this.props.name}
                        name="deploymentName"
                        ref={(input) => this.nameInput = input}
                        required/>
                    <label><b>Description:</b></label>
                    <input
                        type="text"
                        placeholder="Enter description name"
                        defaultValue={this.props.description}
                        name="deploymentDescription"
                        ref={(input) => this.descriptionInput = input}
                        required/>
                    <label><b>Parameters:</b></label>
                    <input
                        type="text"
                        placeholder="Enter parameters"
                        defaultValue={this.props.parameters}
                        name="deploymentParameters"
                        ref={(input) => this.parametersInput = input}
                        required/>
                    <button
                        type="button"
                        onClick={() => this.props.save(this.nameInput.value, this.descriptionInput.value,
                            this.parametersInput.value)}>
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

export default EditDeploymentModal