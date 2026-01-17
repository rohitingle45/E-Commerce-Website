import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice.js";
import axios from "axios";
import { updateProduct } from "../../redux/slices/adminProductSlice";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [upolading, setUploading] = useState(false); // Image uploading state

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleProductFormData = (e) => {
    const { name, value } = e.target;
    setProductData((preData) => ({ ...preData, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleProductFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({id,productData}));
    navigate('/admin/products');
  };

  if(loading) return <p>Loading ...</p>
  if(error) return <p>Error:{error}</p>
  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="font-bold text-3xl mb-4">Edit Product</h2>
      <form onSubmit={handleProductFormSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="font-medium block mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleProductFormData}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="font-medium block mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            rows={4}
            onChange={handleProductFormData}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="font-medium block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleProductFormData}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Count In Stock */}
        <div className="mb-6">
          <label className="font-medium block mb-2">CountInStock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleProductFormData}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* sku */}
        <div className="mb-6">
          <label className="font-medium block mb-2">Sku</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleProductFormData}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="font-medium block mb-2">
            Sizes (Comma seperated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="font-medium block mb-2">
            Colors (Comma seperated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="font-medium block mb-2">Upload Image</label>
          {upolading && <p>Uploading image...</p>}
          <input type="file" onChange={handleUploadImage} />
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow-sm"
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 rounded p-2 text-white transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
