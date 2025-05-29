import React, { useState } from 'react';
import './Addproduct.css';

function Addproduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    stock: ''
  });

  const productVariants = {
    "data": [
      {
        "id": 1027,
        "name": "SMALL",
        "description": "Preemie (for babies 6 lbs and under), Newborn (for babies 10 lbs and under), and Size 1 (for babies 8-14 lbs)",
        "productId": 1023,
        "price": 10,
        "stock": 6,
        "imageUrl": "string",
        "trayNumber": 0
      },
      {
        "id": 1028,
        "name": "MEDIUM",
        "description": "Suitable for babies weighing between 7-12 kg or 15-26 lbs",
        "productId": 1023,
        "price": 15,
        "stock": 11,
        "imageUrl": "string",
        "trayNumber": 1
      },
      {
        "id": 1029,
        "name": "LARGE",
        "description": "Typically referring to sizes 5, 6, 7, and 8. Size 5 is for babies 27+ lbs, Size 6 is for babies 35+ lbs, and Size 7 is for babies 41+ lbs. Size 8 is for babies 46+ lbs, and beyond",
        "productId": 1023,
        "price": 20,
        "stock": 11,
        "imageUrl": "string",
        "trayNumber": 2
      },
      {
        "id": 1030,
        "name": "WIPES",
        "description": "Perfect for keeping your baby's skin clean and comfortable",
        "productId": 1023,
        "price": 5,
        "stock": 12,
        "imageUrl": "string",
        "trayNumber": 3
      },
      {
        "id": 1031,
        "name": "TISSUE",
        "description": "Highlight the ease of use and portability of tissues for on-the-go cleaning or wipinge",
        "productId": 1023,
        "price": 5,
        "stock": 12,
        "imageUrl": "string",
        "trayNumber": 4
      }
    ],
    "message": "Product variants retrieved successfully",
    "success": true
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData({
      price: product.price.toString(),
      stock: product.stock.toString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requestData = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        productId: selectedProduct.productId,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: selectedProduct.imageUrl,
        trayNumber: selectedProduct.trayNumber
      };

      console.log("Submitting data:", requestData);

      // Updated endpoint URL
      const response = await fetch(
        `http://160.187.221.146:8585/api/ProductVariant/updateProductVariant`,
        {
          method: 'POST', // Keep as POST if that's what the API expects
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        }
      );

      // First check if the response is OK
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.log("Couldn't parse error response", e);
        }
        throw new Error(errorMessage);
      }

      // Try to parse successful response
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.log("Couldn't parse success response", e);
        // If no JSON response, but status is OK, consider it a success
        setSuccess('Product variant updated successfully!');
        return;
      }

      if (responseData && !responseData.success) {
        throw new Error(responseData.message || "Update failed");
      }

      console.log("Update successful:", responseData);
      setSuccess('Product variant updated successfully!');
      
      // Update the local product data with the new values
      const updatedProducts = productVariants.data.map(p => 
        p.id === selectedProduct.id ? { ...p, price: parseFloat(formData.price), stock: parseInt(formData.stock) } : p
      );
      productVariants.data = updatedProducts;
      
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || "Failed to update product variant. Please check the data and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  return (
    <div className="container">
      <h1>Update Osorio Diaper Vendo</h1>
      
      {error && <div className="error">Error: {error}</div>}
      {success && <div className="success">{success}</div>}
      {loading && <div className="loading">Updating osorio product ...</div>}

      <div className="product-selection">
        <h2>Select a Product:</h2>
        <div className="product-grid">
          {productVariants.data.map(product => (
            <div 
              key={product.id}
              className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product)}
            >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-info">
                {/* <span>Price: ₱{product.price}</span>
                <span>Stock: {product.stock}</span> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Variant: {selectedProduct.name}</label>
            <input
              type="text"
              value={`ID: ${selectedProduct.id}`}
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product Variant'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Addproduct;