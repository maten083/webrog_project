import { Form } from '../elements/form.js';
import { Modal } from '../elements/popup.js';
import Store from '../store.js';
import { Page } from './page.js';

export class Checkout extends Page {
    container;
    orderSuccess;

    constructor(title, body) {
        super('Checkout', title, body);
        this.orderSuccess = new Modal('orderSuccessPopup', 'Order Placed Successfully', 'Thank you for your purchase!');
    }

    show() {
        this.validateItemPresence();

        this.displayHeader();
        this.displayBack();

        this.displayContainer();
        this.displayOrderSummary();
        this.displayForms();
        this.displayPlaceOrder();
        this.body.appendChild(this.orderSuccess.compile());

        this.displayFooter();
    }
    validateItemPresence() {
        if (Store.checkoutItems.length === 0) {
            window.location.href = '?target=cart';
            console.log("a");
        }
    }
    displayHeader() {
        const header = this.createElement('header');
        const title = this.createElement('h1', '', '', 'Checkout');
        header.appendChild(title);
        this.body.appendChild(header);
    }
    displayBack() {
        const back = this.createElement('a', 'backToHome', '', 'Go back to home page');
        back.href = '?target=main';
        this.body.appendChild(back);
    }
    displayContainer() {
        this.container = this.createElement('div', '', 'container');
        this.body.appendChild(this.container);
    }
    displayOrderSummary() {
        const orderItems = this.createElement('div', 'cartItems');
        
        Store.checkoutItems.forEach((item) => {
            const product = Store.productMap.get(item.id);

            const cartItem = this.createElement('div', '', 'cart-item');
    
            const itemName = this.createElement('span', '', '', product.name);
            cartItem.appendChild(itemName);

            const quantity = this.createElement('span', '', '', `Quantity: ${item.quantity}`);
            cartItem.appendChild(quantity);
    
            const itemPrice = this.createElement('span', '', '', `$${(product.price * item.quantity).toFixed(2)}`);
            cartItem.appendChild(itemPrice);
    
            orderItems.appendChild(cartItem);
        });
        this.container.appendChild(orderItems);
    }
    displayForms() {
        const addressForm = (new Form('addressForm', 'Shipping Address'))
            .addField('name', 'Name:')
            .addField('address', 'Address:')
            .addField('city', 'City:')
            .addField('state', 'State:')
            .addField('zip', 'ZIP Code:');

        this.container.appendChild(addressForm.compile());

        const paymentMethod = (new Form('paymentForm', 'Payment Method'))
            .addField('cardNumber', 'Card Number:')
            .addField('cardExpiry', 'Card Expiry:')
            .addField('cardCvc', 'CVC:')
            .addField('paymentMethod', 'Payment Method:', 'select', true, [
                {
                    value: '',
                    disabled: true,
                    selected: true,
                    name: 'Select Payment Method'
                },
                {
                    value: 'creditCard',
                    name: 'Credit Card'
                },
                {
                    value: 'paypal',
                    name: 'PayPal'
                },
                {
                    value: 'bankTransfer',
                    name: 'Bank Transfer'
                }
            ]);
        this.container.appendChild(paymentMethod.compile());
    }
    displayPlaceOrder() {
        const btn = this.createElement('button', 'placeOrderBtn', '', 'Place Order');
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zip = document.getElementById('zip').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvc = document.getElementById('cardCvc').value;
    
            // Perform validation on the form fields
            if (!name || !address || !city || !state || !zip || !cardNumber || !cardExpiry || !cardCvc) {
                alert('Please fill in all the required fields.');
                return;
            }
    
            // Place the order and show the success popup
            this.orderSuccess.show();
        });
        this.container.appendChild(btn);
    }
}