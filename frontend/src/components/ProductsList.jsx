// src/components/ProductsList.jsx
import { Link } from "react-router-dom";

const ProductsList = ({ products = [], title = "" }) => {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="border p-2 rounded hover:shadow"
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <div className="text-sm">{product.name}</div>
              <div className="font-bold text-blue-600">${product.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
