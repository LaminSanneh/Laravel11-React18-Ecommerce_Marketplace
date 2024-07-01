export const generateMockProducts = (count: number) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const product = {
      id: i,
      name: `Product ${i}`,
      price: (Math.random() * 100).toFixed(2),
      category: `Category ${Math.floor(Math.random() * 5) + 1}`,
      stock: Math.floor(Math.random() * 100),
      variants: [{ variantName: "", variantPrice: "", variantStock: "" }],
    };
    products.push(product);
  }
  return products;
};
