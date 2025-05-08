import React from "react";

const Popup = ({ message, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 h-40 flex flex-col justify-between">
        <p className="text-gray-800 text-left">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
