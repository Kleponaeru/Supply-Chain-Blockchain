import React from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <IoClose />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
