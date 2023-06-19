import { Page } from "./page.js";
import Store from "../store.js";

export class Main extends Page {
    cartIcon;
    cartCount;
    cartWrapper;
    
    constructor(title, body) {
        super("Main", title, body);

        this.initCart();
    }

    initCart() {
        this.cartWrapper = this.createElement('span', 'cartIcon');
        this.cartIcon = this.createElement('i', '', 'fas fa-shopping-cart');
        this.cartCount = this.createElement('span', 'cartCount');

        this.cartWrapper.appendChild(this.cartIcon);

        this.cartWrapper.addEventListener('click', () => {
            window.location.href = '?target=cart';
        });
    }

    show() {
        this.displayHeader();
        this.displayProducts();
        this.updateCart();

        this.displayFooter();
    }

    displayHeader() {
        const header = this.createElement('header');
        const title = this.createElement('h1', '', '', 'Airsoft Store');
        const cartContainer = this.createElement('div', 'cartContainer');
        
        cartContainer.appendChild(this.cartWrapper);
        cartContainer.appendChild(this.cartCount);

        header.appendChild(title);
        header.appendChild(cartContainer);

        this.body.appendChild(header);
    }

    displayProducts() {
        const container = this.createElement('div', '', 'container', '');
        const title = this.createElement('h1', '', '', 'Product List');

        const productList = this.createElement('div', 'productList');
    
        Store.products.forEach((product) => {
            const productCard = this.createElement('div', '', 'product-card');
    
            const productImage = this.createImage(product.image, product.name);
            productCard.appendChild(productImage);
    
            const productName = this.createElement('h3', '', '', product.name);
            productCard.appendChild(productName);
    
            const productPrice = this.createElement('p', '', '', `$${product.price.toFixed(2)}`);
            productCard.appendChild(productPrice);
    
            const addToCartBtn = this.createElement('button', '', '', 'Add to Cart');
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(product.id);
            });
            productCard.appendChild(addToCartBtn);
    
            productList.appendChild(productCard);
        });

        container.appendChild(title);
        container.appendChild(productList);

        this.body.appendChild(container);
    }

    addToCart(productId) {
        const productIndex = Store.cart.findIndex((item) => item.id === productId);
        if (productIndex === -1) {
            Store.cart.push({
                id: productId,
                quantity: 1
            });
        } else {
            Store.cart[productIndex].quantity++;
        }
        Store.saveCart();

        this.updateCart();
    }
    updateCart() {
        let count = 0;
        Store.cart.forEach((item) => {
            count += item.quantity;
        })
        this.cartCount.innerText = count;
    }
}