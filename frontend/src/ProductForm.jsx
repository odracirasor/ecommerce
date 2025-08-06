import React, { useState } from "react";
import axios from "axios";

function ProductForm() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setImageUrl(res.data.url);
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {imageUrl && <img src={imageUrl} alt="Product" width={200} />}
    </div>
  );
}

export default ProductForm;
