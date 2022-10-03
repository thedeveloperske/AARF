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
      height: "auto",
      width: "auto",
      transform: "translate(-50%, -50%)",
      boxShadow: "5px 10px 8px 10px #888888",
      backgroundColor: props.background,
    },
    overlay: { zIndex: 1000 },
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div>{props.body}</div>
      <div
        style={{
          position: "static",
          bottom: "0",
          margin: "5px",
        }}
      >
        <button className="btn btn-info" onClick={props.closeModal}>
          Ok
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
