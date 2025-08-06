import React from "react";

const ProductThumbnailGallery = ({
  images = [],
  mainImage,
  setMainImage,
  openModal,
  video,
  videoThumbnail, // <-- opcional
}) => {
  const isActive = (src) => src === mainImage;

  return (
    <div className="flex mt-4 gap-2 flex-wrap">
      {/* Miniaturas de imagens */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`thumb-${i}`}
          onClick={() => {
            setMainImage(img);
            openModal(img);
          }}
          className={`w-24 h-24 object-cover cursor-pointer border ${
            isActive(img) ? "border-blue-500" : "border-gray-300"
          } rounded hover:scale-105 transition-transform duration-200`}
        />
      ))}

      {/* Miniatura de vídeo (com ou sem thumbnail) */}
      {video && (
        <div
          onClick={() => {
            setMainImage(video);
            openModal(video);
          }}
          className={`relative w-24 h-24 cursor-pointer rounded overflow-hidden border ${
            isActive(video) ? "border-blue-500" : "border-gray-300"
          } hover:scale-105 transition-transform duration-200`}
        >
          <video
            src={video}
            poster={videoThumbnail}
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span className="text-white text-sm">🎥</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductThumbnailGallery;
