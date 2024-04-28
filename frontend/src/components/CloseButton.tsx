import React from "react";

interface CloseButton {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButton> = ({ onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <button type="button" className="btn-close" onClick={handleClose}></button>
  );
};

export default CloseButton;
