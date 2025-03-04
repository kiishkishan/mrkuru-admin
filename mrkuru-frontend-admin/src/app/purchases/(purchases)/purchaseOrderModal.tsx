/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import React from "react";

type PurchaseOrderModalProps = {
  closeModal: () => void;
  instance: any;
};

const PurchaseOrderModal = ({
  closeModal,
  instance,
}: PurchaseOrderModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-5 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Purchase Order Preview
        </h2>

        {/* PDF Preview */}
        {instance.url ? (
          <iframe
            src={instance.url}
            className="w-full h-96 border rounded-lg"
          ></iframe>
        ) : (
          <p className="text-center text-gray-500">Generating PDF preview...</p>
        )}

        {/* Download PDF */}
        <div className="mt-4 flex justify-end">
          <a
            href={instance.url || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;
