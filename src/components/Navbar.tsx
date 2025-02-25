import { Link } from 'react-router-dom';
import { useCart } from '../context/cart';

const Navbar = () => {
    const [cart] = useCart();

    const cartItemCount = cart.reduce((total, item) => total + item.count, 0);

    return (
        <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
                <Link
                    to="/"
                    className="text-2xl md:text-3xl font-extrabold tracking-tight transform transition-all duration-300 hover:scale-105 hover:text-green-100"
                >
                    Food Product Explorer
                </Link>
                <div className="space-x-4 md:space-x-6 flex items-center">
                    <a
                        href="https://world.openfoodfacts.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-200 text-nowrap transition-colors duration-300 font-semibold text-sm md:text-base relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                    >
                        Open Food Facts
                    </a>
                    <Link
                        to="/cart"
                        className="relative hover:text-green-200 transition-colors duration-300 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;