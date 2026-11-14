// Exchange rate: how many pesos equal 1 US dollar (keep the same as EcoProductCard.jsx)
const PHP_PER_USD = 64.5;

// Converts a peso amount to a formatted USD price
const formatUSD = (php) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(php / PHP_PER_USD);

export default function CartDrawer({ isOpen, setIsOpen, cartItems, updateQuantity, removeItem }) {
  // Subtotal stays in pesos internally and is converted only when displayed
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleGoToCheckout = () => {
    // Save cart state to local storage so the full checkout page can read it
    localStorage.setItem('eco_cart', JSON.stringify(cartItems));
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-y-0 right-0 flex max-w-full w-full md:w-96">
        <div className="w-full h-full bg-[#FDFBF7] shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-6 border-b border-[#F5EBE0]">
            <h2 className="text-xl font-bold text-[#1B4332]">Your Cart</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-black">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex">
                    <img src={item.image} alt={item.title} className="h-20 w-20 rounded-md object-cover border" />
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-[#1B4332]">
                        <h3 className="truncate max-w-[150px]">{item.title}</h3>
                        <p className="ml-4">{formatUSD(item.price * item.quantity)}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between mt-2 text-sm">
                        <div className="flex items-center border rounded-md">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 hover:bg-gray-100">-</button>
                          <span className="px-2">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 hover:bg-gray-100">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-600">Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t px-4 py-6 bg-white">
            <div className="flex justify-between text-lg font-bold text-[#1B4332] mb-4">
              <p>Subtotal</p>
              <p>{formatUSD(subtotal)}</p>
            </div>
            <button
              onClick={handleGoToCheckout}
              disabled={cartItems.length === 0}
              className="w-full rounded-md bg-[#1B4332] px-6 py-3 text-white font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
