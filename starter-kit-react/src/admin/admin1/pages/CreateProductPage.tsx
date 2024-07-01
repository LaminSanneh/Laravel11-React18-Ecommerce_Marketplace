import React from "react";
import ProductForm from "../components/ProductForm";

const CreateProductPage = () => {
  const handleSave = (productData) => {
    // API call to save new product
    console.log("Saving new product:", productData);
  };

  return (
    <div className="container mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Create New Product</h1> */}
      <ProductForm onSave={handleSave} />
    </div>
  );
};

export default CreateProductPage;
