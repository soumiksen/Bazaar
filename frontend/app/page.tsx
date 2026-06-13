import ProductCard from "./components/Card";

export default function Home() {
  // Creating an array of 8 items to cleanly map over
  const products = Array.from({ length: 8 }, (_, i) => ({ id: String(i + 1) }));

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} id={product.id} />
      ))}
    </div>
  );
}