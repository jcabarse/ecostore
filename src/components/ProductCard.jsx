export default function ProductCard({ product, addToCart }) {
  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-[#F5EBE0] hover:shadow-md transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative h-64">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
        />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-semibold text-[#1B4332]">{product.title}</h3>
        <p className="mt-1 text-sm text-gray-600 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-[#1B4332]">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock_quantity === 0}
            className="px-4 py-2 bg-[#D8F3DC] text-[#1B4332] text-sm font-semibold rounded-md hover:bg-[#1B4332] hover:text-[#D8F3DC] transition-colors disabled:opacity-50"
          >
            {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}