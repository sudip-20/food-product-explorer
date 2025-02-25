import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OpenFoodFactsService, Product } from '../services/OpenFoodFactsService';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeQuery, setBarcodeQuery] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useCart();

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortOption, page, searchQuery]);

    useEffect(() => {
        fetchCategories()
    }, []);

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await OpenFoodFactsService.getCategories();
            setCategories(fetchedCategories.slice(0, 50));
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            let result;
            if (selectedCategory) {
                result = await OpenFoodFactsService.getProductsByCategory(selectedCategory, page);
            } else if (searchQuery) {
                result = await OpenFoodFactsService.searchProducts(searchQuery, page);
            } else {
                result = await OpenFoodFactsService.searchProducts('food', page);
            }

            let sortedProducts = result;
            if(page > 1) {
                sortedProducts = [...products, ...result]
            }
            switch(sortOption) {
                case 'name-asc':
                    sortedProducts.sort((a: Product, b: Product) => a.product.product_name.localeCompare(b.product.product_name));
                    break;
                case 'name-desc':
                    sortedProducts.sort((a: Product, b: Product) => b.product.product_name.localeCompare(a.product.product_name));
                    break;
                case 'nutrition-asc':
                    sortedProducts.sort((a: Product, b: Product) => (a.product.nutrition_grade_fr || '').localeCompare(b.product.nutrition_grade_fr || ''));
                    break;
                case 'nutrition-desc':
                    sortedProducts.sort((a: Product, b: Product) => (b.product.nutrition_grade_fr || '').localeCompare(a.product.nutrition_grade_fr || ''));
                    break;
            }
            setProducts(sortedProducts)
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBarcodeSearch = async () => {
        try {
            const product = await OpenFoodFactsService.getProductByBarcode(barcodeQuery);
            setProducts([product]);
        } catch (error) {
            console.error('Failed to fetch product by barcode', error);
        }
    };

    const addToCart = (product: Product) => {
        const existingCartItem = cart.find(item => item.product.code === product.code);
        
        if (existingCartItem) {
            setCart(cart.map(item => 
                item.product.code === product.code 
                    ? { ...item, count: item.count + 1 }
                    : item
            ));
            toast.success(`Added another ${product.product.product_name} to cart`);
        } else {
            setCart([...cart, { product, count: 1 }]);
            toast.success(`Added ${product.product.product_name} to cart`);
        }
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl font-extrabold text-center text-green-800 mb-8 animate-fade-in">
                    Open Food Facts Explorer
                </h1>

                <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 pl-10 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-3 h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by barcode"
                                value={barcodeQuery}
                                onChange={(e) => setBarcodeQuery(e.target.value)}
                                className="w-full p-3 pl-10 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-3 h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>

                        <button 
                            onClick={handleBarcodeSearch} 
                            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5" />
                            </svg>
                            <span>Barcode Search</span>
                        </button>
                    </div>
                </div>

                <div className="mb-8 grid md:grid-cols-2 gap-4">
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => {
                            setSelectedCategory(e.target.value)
                            setPage(1)
                        }}
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select 
                        value={sortOption} 
                        onChange={(e) => {
                            setSortOption(e.target.value)
                            setPage(1)
                        }}
                        className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="nutrition-asc">Nutrition Grade (Ascending)</option>
                        <option value="nutrition-desc">Nutrition Grade (Descending)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div 
                            key={product.code} 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative"
                        >
                            <Link to={`/product/${product.code}`}>
                                {product.product.image_url && (
                                    <div className="relative h-56 overflow-hidden">
                                        <img 
                                            src={product.product.image_url} 
                                            alt={product.product.product_name} 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-green-800 mb-2 line-clamp-2">{product.product.product_name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <strong>Category:</strong> {product.product.categories.split(',').slice(0, 2).join(', ')}
                                    </p>
                                    <div className="flex items-center">
                                        <span className="text-sm font-semibold">Nutrition Grade:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold 
                                            ${product.product.nutrition_grade_fr === 'a' ? 'bg-green-200 text-green-800' : 
                                              product.product.nutrition_grade_fr === 'b' ? 'bg-lime-200 text-lime-800' : 
                                              product.product.nutrition_grade_fr === 'c' ? 'bg-yellow-200 text-yellow-800' : 
                                              product.product.nutrition_grade_fr === 'd' ? 'bg-orange-200 text-orange-800' : 
                                              'bg-red-200 text-red-800'}`}
                                        >
                                            {product.product.nutrition_grade_fr?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <button 
                                onClick={() => addToCart(product)}
                                className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                                aria-label="Add to Cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                {!isLoading && products.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <button 
                            onClick={() => setPage(prevPage => prevPage + 1)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
                        >
                            <span>Load More</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-center mt-8">
                        <div className="w-16 h-16 border-4 border-t-4 border-green-500 border-t-green-200 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
