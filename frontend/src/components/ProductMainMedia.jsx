import React from "react";

const ProductMainMedia = ({ media, zoomed, onZoomToggle, onClick }) => {
  const isVideo = media?.toLowerCase().endsWith(".mp4");

  return (
    <div
      className={`relative border rounded shadow overflow-hidden ${
        zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
      }`}
      onDoubleClick={onZoomToggle}
      onClick={onClick}
    >
      {isVideo ? (
        <video
          controls
          className="w-full h-96 object-contain"
          src={media}
        />
      ) : (
        <img
          src={media}
          alt="Produto"
          className={`w-full h-96 object-contain transition-transform duration-300 ${
            zoomed ? "scale-150" : "scale-100"
          }`}
        />
      )}
    </div>
  );
};

export default ProductMainMedia;
