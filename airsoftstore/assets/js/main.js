// Define sample product data
const products = [
    {
        id: 1,
        name: 'Product 1',
        price: 49.99,
        description: 'This is the description of Product 1.',
        image: 'assets/images/product0.jpg'
    },
    {
        id: 2,
        name: 'Product 2',
        price: 69.99,
        description: 'This is the description of Product 2.',
        image: 'assets/images/product1.jpg'
    },
    {
        id: 3,
        name: 'Product 3',
        price: 29.99,
        description: 'This is the description of Product 3.',
        image: 'assets/images/product2.jpg'
    },
    {
        id: 4,
        name: 'Product 4',
        price: 39.99,
        description: 'This is the description of Product 4.',
        image: 'assets/images/product3.jpg'
    }
];

// Retrieve cart items from local storage (if any)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display products on the page
function displayProducts() {
    const productList = document.getElementById('productList');

    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;
        productCard.appendChild(productImage);

        const productName = document.createElement('h3');
        productName.textContent = product.name;
        productCard.appendChild(productName);

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price.toFixed(2)}`;
        productCard.appendChild(productPrice);

        const addToCartBtn = document.createElement('button');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.addEventListener('click', () => {
            addToCart(product);
        });
        productCard.appendChild(addToCartBtn);

        productList.appendChild(productCard);
    });
}
const cartIcon = document.getElementById('cartIcon');
cartIcon.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Add a product to the cart
function addToCart(product) {
    cart.push(product);
    updateCart();
    saveCartToLocalStorage();
}

// Update the cart display
function updateCart() {
    const cartCount = cart.length;
    const cartCountElement = document.getElementById('cartCount');
    cartCountElement.textContent = cartCount;
}

// Save the cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Call the displayProducts function to render the products
displayProducts();
