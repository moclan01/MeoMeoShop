import React from 'react';
import '../styles/DeleteConfirmModal.css'; // We'll create this CSS file next

function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Xác nhận xóa</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>Bạn có chắc chắn muốn xóa {itemName} này không?</p>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Hủy</button>
          <button className="confirm-button" onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal; 