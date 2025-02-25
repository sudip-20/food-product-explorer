import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OpenFoodFactsService, Product } from '../services/OpenFoodFactsService';
import { useCart } from '../context/cart';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { barcode } = useParams<{ barcode: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (barcode) {
        try {
          const fetchedProduct = await OpenFoodFactsService.getProductByBarcode(barcode);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error('Failed to fetch product details', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [barcode])

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

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-xl text-green-800 animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex flex-col justify-center items-center text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-3xl font-bold text-red-600 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/" 
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const productDetails = product.product;

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          <div className="grid md:grid-cols-2">
            {/* Product Image Section */}
            <div className="relative bg-gray-100 flex items-center justify-center p-8">
              {productDetails.image_url ? (
                <div className="rounded-2xl overflow-hidden shadow-lg max-w-full max-h-[500px]">
                  <img
                    src={productDetails.image_url}
                    alt={productDetails.product_name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-[400px] w-full flex items-center justify-center rounded-2xl">
                  <p className="text-gray-500 text-xl flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>No Image Available</span>
                  </p>
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[600px]">
              <h1 className="text-4xl font-extrabold text-green-800 mb-4 leading-tight">
                {productDetails.product_name}
              </h1>

              {/* Basic Details */}
              <div className="bg-green-50 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-600 font-semibold">Category</p>
                    <p className="text-gray-800">{productDetails.categories || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-green-600 font-semibold">Nutrition Grade</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold 
                      ${productDetails.nutrition_grade_fr === 'a' ? 'bg-green-200 text-green-800' : 
                        productDetails.nutrition_grade_fr === 'b' ? 'bg-lime-200 text-lime-800' : 
                        productDetails.nutrition_grade_fr === 'c' ? 'bg-yellow-200 text-yellow-800' : 
                        productDetails.nutrition_grade_fr === 'd' ? 'bg-orange-200 text-orange-800' : 
                        'bg-red-200 text-red-800'}`}
                    >
                      {productDetails.nutrition_grade_fr?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 01-4.186-3.622l-.372-1.176a2 2 0 00-1.906-1.379h-1.136a2 2 0 01-2-2 2 2 0 012-2h.006c.353 0 .688.114.97.322l1.546 1.088a2 2 0 001.764.264l2.295-.763a2 2 0 001.308-1.57l.243-1.516a2 2 0 00-1.546-2.283l-.83-.144a2 2 0 00-1.248.35L9 5.5M7 9h-2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                  </svg>
                  Ingredients
                </h2>
                <p className="text-gray-700">
                  {productDetails.ingredients_text || 'No ingredients information available'}
                </p>
              </div>

              {/* Nutrition Facts */}
              <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-purple-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nutrition Facts
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Energy', value: productDetails.nutriments.energy_value, unit: 'kJ' },
                    { label: 'Fat', value: productDetails.nutriments.fat, unit: 'g' },
                    { label: 'Carbohydrates', value: productDetails.nutriments.carbohydrates, unit: 'g' },
                    { label: 'Proteins', value: productDetails.nutriments.proteins, unit: 'g' }
                  ].map((nutrient) => (
                    <div key={nutrient.label} className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-purple-600 font-semibold">{nutrient.label}</p>
                      <p className="text-gray-800">
                        {nutrient.value || 'N/A'} {nutrient.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labels */}
              {productDetails.labels && productDetails.labels.length > 0 && (
                <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-indigo-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Labels
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {productDetails.labels.map(label => (
                      <span
                        key={label}
                        className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium transition-colors hover:bg-indigo-300"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;