import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org';

export interface Product {
  code: string;
  product: {
    product_name: string;
    image_url: string;
    categories: string;
    ingredients_text: string;
    nutrition_grade_fr: string;
    nutriments: {
      energy_value: number;
      fat: number;
      carbohydrates: number;
      proteins: number;
    };
    labels: string[];
  };
}

export interface ProductSearchResult {
  products: Product[];
  count: number;
}

export const OpenFoodFactsService = {
  async searchProducts(query: string, page: number = 1, pageSize: number = 20) {
    try {
      const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
        params: {
          search_terms: query,
          json: true,
          page: page,
          page_size: pageSize
        }
      });
      
      return response.data.products.map((product: any) => ({
        code: product.code,
        product: {
          product_name: product.product_name || '',
          image_url: product.image_url || '',
          categories: product.categories || '',
          ingredients_text: product.ingredients_text || '',
          nutrition_grade_fr: product.nutrition_grade_fr || '',
          nutriments: {
            energy_value: product.nutriments?.energy_value || 0,
            fat: product.nutriments?.fat || 0,
            carbohydrates: product.nutriments?.carbohydrates || 0,
            proteins: product.nutriments?.proteins || 0
          },
          labels: product.labels?.split(',') || []
        }
      }))
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  async getProductByBarcode(barcode: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`);
      
      const product = response.data.product;
      return {
        code: response.data.code,
        product: {
          product_name: product.product_name || '',
          image_url: product.image_url || '',
          categories: product.categories || '',
          ingredients_text: product.ingredients_text || '',
          nutrition_grade_fr: product.nutrition_grade_fr || '',
          nutriments: {
            energy_value: product.nutriments?.energy_value || 0,
            fat: product.nutriments?.fat || 0,
            carbohydrates: product.nutriments?.carbohydrates || 0,
            proteins: product.nutriments?.proteins || 0
          },
          labels: product.labels?.split(',') || []
        }
      }
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw error;
    }
  },

  async getProductsByCategory(category: string, page: number = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/category/${category}.json`, {
        params: { page }
      });
      
      return response.data.products.map((product: any) => ({
        code: product.code,
        product: {
          product_name: product.product_name || '',
          image_url: product.image_url || '',
          categories: product.categories || '',
          ingredients_text: product.ingredients_text || '',
          nutrition_grade_fr: product.nutrition_grade_fr || '',
          nutriments: {
            energy_value: product.nutriments?.energy_value || 0,
            fat: product.nutriments?.fat || 0,
            carbohydrates: product.nutriments?.carbohydrates || 0,
            proteins: product.nutriments?.proteins || 0
          },
          labels: product.labels?.split(',') || []
        }
      }))
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await axios.get(`${BASE_URL}/categories.json`);
      return response.data.tags.map((tag: any) => tag.name);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};