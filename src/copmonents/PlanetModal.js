import React from 'react'
import Modal from 'react-modal';

function PlanetModal(props) {
    Modal.setAppElement('#root');
    return (
        <Modal
            isOpen={props.shouldBeVisible}
            contentLabel="Example Modal">

            <h2>Hello</h2>
            <button onClick={() => {props.setShoudShowPlanetDetails(false)}}>close</button>
            <div>I am a modal{props.selectedPlanetId}</div>
            <form>
                <input />
                <button>tab navigation</button>
                <button>stays</button>
                <button>inside</button>
                <button>the modal</button>
            </form>
        </Modal>
    )
}

export default PlanetModal;