import { Link } from 'react-router-dom';
import { useCart } from '../context/cart';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Product } from '../services/OpenFoodFactsService';

const CartPage = () => {
  const [cart, setCart] = useCart();

  const handleRemoveFromCart = (productCode: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.code !== productCode));
  };

  const handleUpdateQuantity = (product: Product, newCount: number) => {
    if (newCount <= 0) {
      handleRemoveFromCart(product.code);
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.product.code === product.code 
            ? { ...item, count: newCount }
            : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-8 animate-fade-in">
                Your Cart
            </h1>

            {cart.length === 0 ? (
                <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-24 w-24 mx-auto text-gray-300 mb-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                        />
                    </svg>
                    <p className="text-xl text-gray-600">Your cart is empty</p>
                    <Link 
                        to="/" 
                        className="mt-4 inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-6">
                        {cart.map(({ product, count }) => (
                            <div
                                key={product.code}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 items-center p-4 gap-4 transform transition-all duration-300 hover:-translate-y-1"
                            >
                                {product.product.image_url && (
                                    <div className="flex justify-center md:justify-start">
                                        <img
                                            src={product.product.image_url}
                                            alt={product.product.product_name}
                                            className="w-40 h-40 object-cover rounded-xl"
                                        />
                                    </div>
                                )}
                                <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-center">
                                    <div className="mb-4 md:mb-0 text-center md:text-left">
                                        <h2 className="text-xl font-bold text-green-800 mb-2">
                                            {product.product.product_name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Category: {product.product.categories.split(',')[0]}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => handleUpdateQuantity(product, count - 1)}
                                                className="bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
                                            >
                                                <Minus size={20} className="text-green-600" />
                                            </button>
                                            <span className="px-4 py-2 bg-white text-green-800 font-bold">
                                                {count}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(product, count + 1)}
                                                className="bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
                                            >
                                                <Plus size={20} className="text-green-600" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromCart(product.code)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Remove from cart"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0 text-center md:text-left">
                            <p className="text-xl font-bold text-green-800">
                                Total Items: {totalItems}
                            </p>
                        </div>
                        <div className="flex space-x-4 text-sm sm:text-md md:text-lg text-nowrap">
                            <button
                                onClick={handleClearCart}
                                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center space-x-2"
                            >
                                <Trash2 size={20} />
                                <span>Clear Cart</span>
                            </button>
                            <button
                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
                            >
                                <span>Checkout</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
)
};

export default CartPage;