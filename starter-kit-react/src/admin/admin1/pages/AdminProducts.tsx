import React, { useEffect, useState } from "react";
import { generateMockProducts } from "../productDartaGenerator";
import { Link } from "react-router-dom";

export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
}

const generatedProducts = generateMockProducts(55);

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(products.length);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  const fetchProducts = async (
    filters: { [index: string]: string },
    currentPage: number,
    sortBy: string | number,
    itemsPerPage: number
  ) => {
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        let filtered = generatedProducts;

        // Apply filters
        if (filters.name !== "") {
          filtered = filtered.filter((product) =>
            product.name.toLowerCase().includes(filters.name.toLowerCase())
          );
        }
        if (filters.price !== "") {
          filtered = filtered.filter((product) =>
            product.price.toString().includes(filters.price)
          );
        }
        if (filters.category !== "") {
          filtered = filtered.filter((product) =>
            product.category
              .toLowerCase()
              .includes(filters.category.toLowerCase())
          );
        }
        if (filters.stock !== "") {
          filtered = filtered.filter((product) =>
            product.stock.toString().includes(filters.stock)
          );
        }

        if (sortBy) {
          filtered.sort((a, b) => {
            const order = sortDirection === "asc" ? 1 : -1;
            if (a[sortBy] < b[sortBy]) return -1 * order;
            if (a[sortBy] > b[sortBy]) return 1 * order;
            return 0;
          });
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filtered.slice(startIndex, endIndex);

        resolve({
          data: paginatedData,
          totalItems: filtered.length, // Return total items for pagination calculations
        });

        resolve(paginatedData);
      }, 1000);
    });
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center mt-4 my-8">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 mr-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Previous
          </button>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 mx-1 ${
              currentPage === page
                ? "bg-blue-500 text-white hover:bg-blue-700"
                : "bg-gray-200 hover:bg-gray-300"
            } rounded`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 ml-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Next
          </button>
        )}
      </div>
    );
  };

  const handlePageChange = (page) => {
    fetchProducts(filters, page, sortBy, itemsPerPage).then((data) => {
      performAfterFetchAction(data);
      setCurrentPage(page);
    });
  };

  const performAfterFetchAction = ({ data, totalItems }) => {
    const productsFromServer = data;
    const numOfPages = Math.ceil(totalItems / itemsPerPage);
    // setTotalPages(numOfPages);
    setTotalPages(numOfPages);
    setProducts(productsFromServer);
    setFilteredProducts(productsFromServer);
  };

  useEffect(() => {
    debugger;
    fetchProducts(filters, currentPage, sortBy, itemsPerPage).then((data) => {
      performAfterFetchAction(data);
    });
  }, []);

  const getPaginatedAndSortedProducts = () => {
    const sortedProducts = [...filteredProducts];

    // Perform sorting based on sortBy and sortDirection
    if (sortBy) {
      sortedProducts.sort((a, b) => {
        const order = sortDirection === "asc" ? 1 : -1;
        if (a[sortBy] < b[sortBy]) return -1 * order;
        if (a[sortBy] > b[sortBy]) return 1 * order;
        return 0;
      });
    }

    // Calculate start and end indexes for current page
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = startIndex + itemsPerPage;

    // Return products for the current page
    // return sortedProducts.slice(startIndex, endIndex);
    return sortedProducts;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    fetchProducts(filters, currentPage, sortBy, itemsPerPage).then((data) => {
      // const numOfPages = Math.ceil(totalItems / itemsPerPage);
      // setFilteredProducts(data);
      setCurrentPage(1); // Reset to the first page after filtering
      performAfterFetchAction(data);
      // setTotalPages(numOfPages);
    });
  };

  const handleSort = (column) => {
    let newSortDirection;
    if (sortBy === column) {
      newSortDirection = sortDirection === "asc" ? "desc" : "asc";
      // setSortDirection(sortDirection);
    } else {
      setSortBy(column);
      newSortDirection = "asc";
      // setSortDirection("asc");
    }
    setSortDirection(newSortDirection);

    // fetchProducts(filters, currentPage, column, itemsPerPage).then((data) => {
    //   performAfterFetchAction(data);
    // });
  };

  const paginatedProducts = getPaginatedAndSortedProducts();

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-5">
        <Link
          to={"/admin1/products/create"}
          className="bg-emerald-500 hover:bg-emerald-700 text-white hover:text-white font-bold py-2 px-4 rounded ml-5"
        >
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 ml-5">
        {/* <input
          type="text"
          // value={searchTerm}
          // onChange={handleSearch}
          placeholder="Search products..."
          className="border rounded mr-2 px-2 py-1"
        /> */}
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Filter by Name"
          className="border rounded mr-2 px-2 py-1"
        />
        <input
          type="text"
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
          placeholder="Filter by Price"
          className="border rounded mr-2 px-2 py-1"
        />
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Filter by Category"
          className="border rounded mr-2 px-2 py-1"
        />
        <input
          type="text"
          name="stock"
          value={filters.stock}
          onChange={handleFilterChange}
          placeholder="Filter by Stock"
          className="border rounded mr-2 px-2 py-1"
        />
        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Product List */}
      <table className="min-w-full bg-white border-gray-200 shadow-md rounded">
        <thead>
          <tr>
            <th
              className="border-b-2 px-4 py-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Product Name{" "}
              {sortBy === "name" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              className="border-b-2 px-4 py-2 cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price{" "}
              {sortBy === "price" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              className="border-b-2 px-4 py-2 cursor-pointer"
              onClick={() => handleSort("category")}
            >
              Category{" "}
              {sortBy === "category" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              className="border-b-2 px-4 py-2 cursor-pointer"
              onClick={() => handleSort("stock")}
            >
              Stock{" "}
              {sortBy === "stock" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th className="border-b-2 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {/* {filteredProducts.map((product) => ( */}
          {paginatedProducts.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2 text-center">{product.name}</td>
              <td className="border px-4 py-2 text-center">{product.price}</td>
              <td className="border px-4 py-2 text-center">{product.category}</td>
              <td className="border px-4 py-2 text-center">{product.stock}</td>
              <td className="border px-4 py-2 text-center">
                <Link
                  to={`/admin1/products/edit/${product.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded"
                >
                  Edit
                </Link>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4">
        {renderPagination()}
        {/* Implement your pagination component here */}
        {/* Example: <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> */}
      </div>
    </div>
  );
};

export default AdminProducts;
