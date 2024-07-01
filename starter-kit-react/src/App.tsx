import React from "react";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Admin1 from "./admin/admin1/pages/Admin1";
import AdminProducts from "./admin/admin1/pages/AdminProducts";
import EditProductPage from "./admin/admin1/pages/EditProductPage";
import CreateProductPage from "./admin/admin1/pages/CreateProductPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <h1 className="text-5xl font-bold underline mb-8">
          Multi Vendor Ecommerce Marketplace
        </h1>
        <div className="rounded-lg border-l-black-500 border bg-gray-50 flex w-10/12 ml-auto mr-auto">
          <div className="w-2/12 bg-white p-5 border-r border-r-1">
            <div className="h-20 flex flex-col justify-center">
              <p className="text-2xl font-bold">Ecommerce</p>
            </div>
            <ul>
              <li>
                <Link
                  to={"/admin1"}
                  className="mb-4 text-blue-600 bg-blue-100 p-4 font-bold block hover:bg-blue-200 rounded-md hover:border-r-indigo-400 hover:border-r-4 border border-r-indigo-400 border-r-4"
                >
                  Dashboard
                </Link>
              </li>
              {["Products", "Orders", "Reports"].map((item) => {
                return (
                  <li>
                    <Link
                      to={"/admin1/products"}
                      className="mb-4 text-gray-700 p-4 font-bold block hover:bg-blue-200 rounded-md hover:border-r-indigo-400 hover:border-r-4"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-10/12 bg-white">
            <div className="bg-white p-5">
              <h1>Search box here</h1>
            </div>
            <Routes>
              <Route path="/admin1" element={<Admin1 />} />
              <Route path="/admin1/products" element={<AdminProducts />} />
              <Route path="/admin1/products/create" element={<CreateProductPage />} />
              <Route path="/admin1/products/edit/:id" element={<EditProductPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
