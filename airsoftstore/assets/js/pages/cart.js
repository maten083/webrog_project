import Store from "../store.js";
import { Page } from "./page.js";

export class Cart extends Page {
    container;
    cartItems = null;
    cartTotal = null;
    clearCartBtn = null;
    checkoutBtn = null;

    constructor(title, body) {
        super('Cart', title, body);
        this.container = this.createElement('div', '', 'container');
    }

    show() {
        this.displayHeader();
        this.displayBack();

        this.body.appendChild(this.container);

        this.displayCartItems();
        this.displayCartTotal();
        this.displayClearCartBtn();
        this.displayCheckoutButton();
        this.displayFooter();
    }
    displayHeader() {
        const header = this.createElement('header');
        const title = this.createElement('h1', '', '', 'Cart');
        header.appendChild(title);
        this.body.appendChild(header);
    }
    displayBack() {
        const back = this.createElement('a', 'backToHome', '', 'Go back to home page');
        back.href = '?target=main';
        this.body.appendChild(back);
    }
    displayCartItems() {
        if (this.cartItems === null) {
            this.cartItems = this.createElement('div', 'cartItems');
            this.container.appendChild(this.cartItems);
        }
        this.cartItems.innerHTML = '';
    
        Store.cart.forEach((item) => {
            const product = Store.productMap.get(item.id);

            const cartItem = this.createElement('div', '', 'cart-item');
    
            const itemName = this.createElement('span', '', '', product.name);
            cartItem.appendChild(itemName);

            const quantity = this.createElement('span', '', '', `Quantity: ${item.quantity}`);
            cartItem.appendChild(quantity);
    
            const itemPrice = this.createElement('span', '', '', `$${(product.price * item.quantity).toFixed(2)}`);
            cartItem.appendChild(itemPrice);
    
            const removeBtn = this.createElement('button', '', '', 'Remove');
            cartItem.appendChild(removeBtn);
            removeBtn.addEventListener('click', () => {
                this.removeItem(item.id);
                cartItem.remove();
                this.displayCartTotal();
            });
    
            this.cartItems.appendChild(cartItem);
        });
    }
    displayCartTotal() {
        if (this.cartTotal === null) {
            this.cartTotal = this.createElement('div', 'cartTotal');
            this.container.appendChild(this.cartTotal);
        }
        const total = Store.cart.reduce((acc, item) => acc + (Store.productMap.get(item.id).price * item.quantity), 0);
        this.cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
    displayClearCartBtn() {
        if (this.clearCartBtn === null) {
            this.clearCartBtn = this.createElement('button', 'clearCartBtn', '', 'Clear Cart');
            this.clearCartBtn.addEventListener('click', () => {
                this.clearCart();
                this.displayCartItems();
                this.displayCartTotal();
            });

            this.container.appendChild(this.clearCartBtn);
        }
    }

    displayCheckoutButton() {
        if (this.checkoutBtn === null) {
            this.checkoutBtn = this.createElement('button', 'checkoutBtn', '', 'Checkout');
            this.checkoutBtn.addEventListener('click', () => {
                localStorage.setItem('checkoutItems', JSON.stringify(Store.cart));
                this.clearCart();
                window.location.href = '?target=checkout';
            });

            this.container.appendChild(this.checkoutBtn);
        }
    }
    removeItem(productId) {
        const productIndex = Store.cart.findIndex((item) => item.id === productId);
        if (productIndex !== -1) {
            Store.cart.splice(productIndex, 1);
            Store.saveCart();
        }
    }
    clearCart() {
        Store.cart.length = 0;
        Store.saveCart();
    }
}