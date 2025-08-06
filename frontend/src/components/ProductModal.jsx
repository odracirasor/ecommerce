import React from "react";

const ProductModal = ({ content, onClose }) => {
  if (!content) return null;

  const isVideo = content?.toLowerCase().endsWith(".mp4");

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        {isVideo ? (
          <video
            controls
            autoPlay
            src={content}
            className="max-w-full max-h-[90vh] rounded shadow-lg"
          />
        ) : (
          <img
            src={content}
            alt="Zoomed"
            className="max-w-full max-h-[90vh] rounded shadow-lg"
          />
        )}
        <button
          className="absolute top-4 right-6 text-white text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
