import React from "react";

interface LargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const LargeModal: React.FC<LargeModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-2xl w-full max-w-2xl h-fit p-8 relative flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
        )}
        <div className="flex-grow overflow-auto w-full p-4">{children}</div>
      </div>
    </div>
  );
};

export default LargeModal;
