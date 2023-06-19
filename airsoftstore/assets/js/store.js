import { Cart } from "./pages/cart.js";
import { Checkout } from "./pages/checkout.js";
import { Main } from "./pages/main.js";

export default class Store {  
    static products = [];
    static productMap = new Map();
    static cart = [];
    static checkoutItems = [];
    body;
    title;

    constructor() {
        fetch('assets/data/products.json').then(response => response.json()).then(json => {
            Store.products = json;

            json.forEach((product) => {
                Store.productMap.set(product.id, product);
            })
            Store.cart = JSON.parse(localStorage.getItem('cart')) || [];
            Store.checkoutItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];

            window.addEventListener('locationchange', this.handleLocation.bind(this));
            this.body = document.querySelector('body');
            this.title = document.querySelector('title');
    
            this.handleLocation();
        });
    }

    static saveCart() {
        localStorage.setItem('cart', JSON.stringify(Store.cart));
    }

    handleLocation() {
        const params = new URLSearchParams(window.location.search);
        let page;
        switch (params.get('target')) {
            case 'cart':
                page = new Cart(this.title, this.body);
                break;
            case 'checkout':
                page = new Checkout(this.title, this.body);
                break;
            default:
                page = new Main(this.title, this.body);
                break;
        }

        page.show();
    }
}