document.addEventListener('DOMContentLoaded', function() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const orderSuccessPopup = document.getElementById('orderSuccessPopup');

    placeOrderBtn.addEventListener('click', function(event) {
        event.preventDefault();
        placeOrder();
    });

    closePopupBtn.addEventListener('click', function() {
        hidePopup();
    });

    // Function to place the order
    function placeOrder() {
        // Get the address and payment details
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
        showPopup();
    }

    // Function to show the success popup
    function showPopup() {
        orderSuccessPopup.style.display = 'flex';
    }

    // Function to hide the success popup
    function hidePopup() {
        orderSuccessPopup.style.display = 'none';
    }
});
