import React, { useState } from "react";
import ProductMainMedia from "../components/ProductMainMedia";
import ProductThumbnailGallery from "../components/ProductThumbnailGallery";
import ProductModal from "../components/ProductModal";

/**
 * Galeria principal do produto
 */
const ProductGallery = ({ images = [], mainImage, setMainImage, video }) => {
  const [zoomed, setZoomed] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleZoomToggle = () => setZoomed((prev) => !prev);
  const openModal = (content) => {
    setModalContent(content);
    setZoomed(false);
  };
  const closeModal = () => setModalContent(null);

  return (
    <div>
      <ProductMainMedia
        media={mainImage}
        zoomed={zoomed}
        onZoomToggle={handleZoomToggle}
        onClick={() => openModal(mainImage)}
      />

      <ProductThumbnailGallery
        images={images}
        mainImage={mainImage}
        setMainImage={setMainImage}
        openModal={openModal}
        video={video}
      />

      <ProductModal content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default ProductGallery;
