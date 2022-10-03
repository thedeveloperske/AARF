import Modal from "react-modal";

const Modal5 = (props) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      height: "auto",
      width: "auto",
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
    >
      {props.header}
      {props.body}
      {props.buttons}
    </Modal>
  );
};

export default Modal5;
