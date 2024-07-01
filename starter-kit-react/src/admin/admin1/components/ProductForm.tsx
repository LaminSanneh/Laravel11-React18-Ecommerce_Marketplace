import React, { useState, useEffect } from "react";

const variantTypes = ["Size", "Color", "Material", "Style", "Other"];

const ProductForm = ({ initialProduct = {}, onSave }) => {
  // const [formData, setFormData] = useState({
  //     name: '',
  //     price: '',
  //     category: '',
  //     stock: '',
  //     description: '',
  //     variants: [{ variantName: '', variantPrice: '', variantStock: '' }],
  //     images: []
  // });

  // useEffect(() => {
  //     if (product) {
  //         setFormData(product);
  //     }
  // }, [product]);

  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  // };

  // const handleVariantChange = (index, e) => {
  //     const { name, value } = e.target;
  //     const newVariants = [...formData.variants];
  //     newVariants[index][name] = value;
  //     setFormData({ ...formData, variants: newVariants });
  // };

  // const addVariant = () => {
  //     setFormData({
  //         ...formData,
  //         variants: [...formData.variants, { variantName: '', variantPrice: '', variantStock: '' }]
  //     });
  // };

  // const removeVariant = (index) => {
  //     const newVariants = formData.variants.filter((_, i) => i !== index);
  //     setFormData({ ...formData, variants: newVariants });
  // };

  // const handleImageChange = (e) => {
  //     const files = Array.from(e.target.files);
  //     const newImages = files.map(file => ({
  //         file,
  //         preview: URL.createObjectURL(file)
  //     }));
  //     setFormData({ ...formData, images: [...formData.images, ...newImages] });
  // };

  // const removeImage = (index) => {
  //     const newImages = formData.images.filter((_, i) => i !== index);
  //     setFormData({ ...formData, images: newImages });
  // };

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     onSave(formData);
  // };

  // return (
  //     <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-white p-8 border border-gray-200 rounded shadow-md">
  //         <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Create New Product'}</h2>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
  //             <input
  //                 type="text"
  //                 name="name"
  //                 value={formData.name}
  //                 onChange={handleChange}
  //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                 required
  //             />
  //         </div>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
  //             <input
  //                 type="number"
  //                 name="price"
  //                 value={formData.price}
  //                 onChange={handleChange}
  //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                 required
  //             />
  //         </div>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
  //             <input
  //                 type="text"
  //                 name="category"
  //                 value={formData.category}
  //                 onChange={handleChange}
  //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                 required
  //             />
  //         </div>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
  //             <input
  //                 type="number"
  //                 name="stock"
  //                 value={formData.stock}
  //                 onChange={handleChange}
  //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                 required
  //             />
  //         </div>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
  //             <textarea
  //                 name="description"
  //                 value={formData.description}
  //                 onChange={handleChange}
  //                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                 required
  //             />
  //         </div>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Variants</label>
  //             {formData.variants.map((variant, index) => (
  //                 <div key={index} className="mb-2 flex space-x-2">
  //                     <input
  //                         type="text"
  //                         name="variantName"
  //                         placeholder="Variant Name"
  //                         value={variant.variantName}
  //                         onChange={(e) => handleVariantChange(index, e)}
  //                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                         required
  //                     />
  //                     <input
  //                         type="number"
  //                         name="variantPrice"
  //                         placeholder="Variant Price"
  //                         value={variant.variantPrice}
  //                         onChange={(e) => handleVariantChange(index, e)}
  //                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                         required
  //                     />
  //                     <input
  //                         type="number"
  //                         name="variantStock"
  //                         placeholder="Variant Stock"
  //                         value={variant.variantStock}
  //                         onChange={(e) => handleVariantChange(index, e)}
  //                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //                         required
  //                     />
  //                     <button
  //                         type="button"
  //                         onClick={() => removeVariant(index)}
  //                         className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
  //                     >
  //                         Remove
  //                     </button>
  //                 </div>
  //             ))}
  //             <button
  //                 type="button"
  //                 onClick={addVariant}
  //                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  //             >
  //                 Add Variant
  //             </button>
  //         </div>
  //         <div className="mb-4">
  //             <label className="block text-gray-700 text-sm font-bold mb-2">Product Images</label>
  //             <input
  //                 type="file"
  //                 accept="image/*"
  //                 multiple
  //                 onChange={handleImageChange}
  //                 className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
  //             />
  //             <div className="mt-4 flex flex-wrap">
  //                 {formData.images.map((image, index) => (
  //                     <div key={index} className="relative w-32 h-32 m-2">
  //                         <img
  //                             src={image.preview}
  //                             alt="Product Preview"
  //                             className="w-full h-full object-cover rounded"
  //                         />
  //                         <button
  //                             type="button"
  //                             onClick={() => removeImage(index)}
  //                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
  //                         >
  //                             &times;
  //                         </button>
  //                     </div>
  //                 ))}
  //             </div>
  //         </div>
  //         <div className="flex items-center justify-between">
  //             <button
  //                 type="submit"
  //                 className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  //             >
  //                 Save
  //             </button>
  //         </div>
  //     </form>
  // );

  //   const categories = [
  //     { id: 1, name: "Electronics" },
  //     { id: 2, name: "Clothing" },
  //     { id: 3, name: "Books" },
  //     { id: 4, name: "Home" },
  //     { id: 5, name: "Toys" },
  //   ];

  const existingCategories = ["Category A", "Category B", "Category C"]; // Example existing categories

  const [product, setProduct] = useState(initialProduct);
  const [variants, setVariants] = useState(initialProduct.variants || []);
  const [newVariant, setNewVariant] = useState({
    type: "",
    name: "",
    price: "",
    stock: "",
  });
  const [customName, setCustomName] = useState("");
  const [images, setImages] = useState(initialProduct.images || []);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    product.categories || []
  );
  const [newCategory, setNewCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant({ ...newVariant, [name]: value });
  };

  const handleVariantTypeChange = (e) => {
    const { value } = e.target;
    setNewVariant({ ...newVariant, type: value, name: "" });
    setCustomName("");
  };

  const handleCustomNameChange = (e) => {
    const { value } = e.target;
    setCustomName(value);
    setNewVariant({ ...newVariant, name: value });
  };

  const handleAddVariant = () => {
    if (validateVariant(newVariant)) {
      setVariants([...variants, newVariant]);
      setNewVariant({ type: "", name: "", price: "", stock: "" });
      setCustomName("");
      setErrors({});
    }
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantEditChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = variants.map((variant, i) =>
      i === index ? { ...variant, [name]: value } : variant
    );
    setVariants(updatedVariants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({ ...product, categories: selectedCategories, variants, images });
      setErrors({});
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...files]);
    setImagePreviews([...imagePreviews, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleCategoryChange = (category, isChecked) => {
    if (isChecked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;
    setSelectedCategories([...selectedCategories, newCategory.trim()]);
    setNewCategory("");
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() === "") return;
    if (!selectedCategories.includes(customCategory.trim())) {
      setSelectedCategories([...selectedCategories, customCategory.trim()]);
      setCustomCategory("");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!product.name) errors.name = "Product name is required";
    if (!product.price || product.price <= 0)
      errors.price = "Valid price is required";
    if (!product.stock || product.stock < 0)
      errors.stock = "Valid stock is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateVariant = (variant) => {
    const errors = {};
    if (!variant.type) errors.variantType = "Variant type is required";
    if (!variant.name) errors.variantName = "Variant name is required";
    if (!variant.price || variant.price <= 0)
      errors.variantPrice = "Valid variant price is required";
    if (!variant.stock || variant.stock < 0)
      errors.variantStock = "Valid variant stock is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-2xl mb-4">
        {initialProduct.id ? "Edit Product" : "Create Product"}
      </h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={product.name || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Price
        </label>
        <input
          type="number"
          name="price"
          value={product.price || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.price && (
          <p className="text-red-500 text-xs italic">{errors.price}</p>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-4">
        <h3 className="text-lg mb-2">Categories</h3>
        <div className="flex flex-wrap">
          {/* Existing Categories Dropdown */}
          <select
            value={newCategory}
            onChange={handleNewCategoryChange}
            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2"
          >
            <option value="" disabled>
              Select Category
            </option>
            {existingCategories.map((category, idx) => (
              <option key={idx} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Add Category
          </button>
          {/* Custom Category Input */}
          <input
            type="text"
            value={customCategory}
            onChange={handleCustomCategoryChange}
            placeholder="New Category"
            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <button
            type="button"
            onClick={handleAddCustomCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Custom Category
          </button>
        </div>
        {/* Selected Categories Display */}
        <div className="flex flex-wrap mt-2">
          {selectedCategories.map((category, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                name={`categories[${index}]`}
                value={category}
                readOnly
                className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(category)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="stock"
        >
          Stock
        </label>
        <input
          type="number"
          name="stock"
          value={product.stock || ""}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.stock && (
          <p className="text-red-500 text-xs italic">{errors.stock}</p>
        )}
      </div>

      {/* Variants Section */}
      <div className="mb-4">
        <h3 className="text-lg mb-2">Product Variants</h3>
        {variants.map((variant, index) => (
          <div key={index} className="flex items-center mb-2">
            <select
              name="type"
              value={variant.type}
              onChange={(e) => handleVariantEditChange(index, e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            >
              <option value="" disabled>
                Select Variant Type
              </option>
              {variantTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="name"
              value={variant.name}
              onChange={(e) => handleVariantEditChange(index, e)}
              placeholder={`Variant ${variant.type}`}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
              type="number"
              name="price"
              value={variant.price}
              onChange={(e) => handleVariantEditChange(index, e)}
              placeholder="Variant Price"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
              type="number"
              name="stock"
              value={variant.stock}
              onChange={(e) => handleVariantEditChange(index, e)}
              placeholder="Variant Stock"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex items-center">
          <select
            name="type"
            value={newVariant.type}
            onChange={handleVariantTypeChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          >
            <option value="" disabled>
              Select Variant Type
            </option>
            {variantTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {newVariant.type === "Other" ? (
            <input
              type="text"
              value={customName}
              onChange={handleCustomNameChange}
              placeholder="Custom Variant Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
          ) : (
            <input
              type="text"
              name="name"
              value={newVariant.name}
              onChange={handleVariantChange}
              placeholder={`Variant ${newVariant.type}`}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
          )}
          <input
            type="number"
            name="price"
            value={newVariant.price}
            onChange={handleVariantChange}
            placeholder="Variant Price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <input
            type="number"
            name="stock"
            value={newVariant.stock}
            onChange={handleVariantChange}
            placeholder="Variant Stock"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <button
            type="button"
            onClick={handleAddVariant}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Variant
          </button>
        </div>
        {errors.variantType && (
          <p className="text-red-500 text-xs italic">{errors.variantType}</p>
        )}
        {errors.variantName && (
          <p className="text-red-500 text-xs italic">{errors.variantName}</p>
        )}
        {errors.variantPrice && (
          <p className="text-red-500 text-xs italic">{errors.variantPrice}</p>
        )}
        {errors.variantStock && (
          <p className="text-red-500 text-xs italic">{errors.variantStock}</p>
        )}
      </div>

      {/* Image Upload Section */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="images"
        >
          Product Images
        </label>
        <input
          type="file"
          name="images"
          onChange={handleImageChange}
          multiple
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="flex flex-wrap mt-2">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative mr-2 mb-2">
              <img
                src={src}
                alt="Preview"
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {initialProduct.id ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
