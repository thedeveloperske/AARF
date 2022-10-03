import Modal from "react-modal";

const Modal6 = (props) => {
    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "0%",
            height: "auto",
            transform: "translate(-50%, -50%)",
            boxShadow: "5px 10px 18px grey",
            backgroundColor: "white",
        },
        overlay: { zIndex: 1000 },
    };

    return (
        <Modal
            isOpen={props.modalIsOpen}
            onRequestClose={props.closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
        >
            {props.header}
            {props.body}
            {props.buttons}
        </Modal>
    );
};

export default Modal6;
