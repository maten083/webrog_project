// Get the cart items from local storage (if any)
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Display the cart items on the page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach((product) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const itemName = document.createElement('span');
        itemName.textContent = product.name;
        cartItem.appendChild(itemName);

        const itemPrice = document.createElement('span');
        itemPrice.textContent = `$${product.price.toFixed(2)}`;
        cartItem.appendChild(itemPrice);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
            removeItem(product);
            displayCartItems();
        });
        cartItem.appendChild(removeBtn);

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartTotal();
}

// Remove an item from the cart
function removeItem(product) {
    const productIndex = cartItems.findIndex((item) => item.id === product.id);
    if (productIndex !== -1) {
        cartItems.splice(productIndex, 1);
        saveCartToStorage();
    }
}

// Clear the cart
function clearCart() {
    cartItems.length = 0;
    saveCartToStorage();
}

// Update the cart total on the page
function updateCartTotal() {
    const cartTotalContainer = document.getElementById('cartTotal');

    const total = cartItems.reduce((acc, product) => acc + product.price, 0);
    cartTotalContainer.textContent = `Total: $${total.toFixed(2)}`;
}

// Save the cart items to local storage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Checkout button event handler
const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', () => {
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    localStorage.removeItem('cart');
    window.location.href = 'checkout.html';
});

// Call the displayCartItems function to render the cart items
displayCartItems();
