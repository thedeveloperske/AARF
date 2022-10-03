import React, { useEffect } from "react";
import Modal from "react-modal";

const CustomModal = (props) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      height: "400px",
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
      <button className="btn btn-info " onClick={props.closeModal}>
        close
      </button>
    </Modal>
  );
};

export default CustomModal;
