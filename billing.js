$(document).ready(function() {
    let cart = [];
    let total = 0;

    // Load categories
    $.ajax({
        url: 'getCategories.php',
        method: 'GET',
        success: function(response) {
            const categories = JSON.parse(response);
            categories.forEach(category => {
                $('#category-container').append(`<button class="category-button" data-category="${category}">${category}</button>`);
            });
        }
    });

    // Load products by category
    $(document).on('click', '.category-button', function() {
        const category = $(this).data('category');
        $.ajax({
            url: 'getProducts.php',
            method: 'GET',
            data: { category: category },
            success: function(response) {
                const products = JSON.parse(response);
                $('#product-container').empty();
                products.forEach(product => {
                    $('#product-container').append(`
                        <div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                            <h3>${product.name}</h3>
                            <p>$${product.price}</p>
                        </div>
                    `);
                });
            }
        });
    });

    // Add item to bill
    $(document).on('click', '.product-card', function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const price = parseFloat($(this).data('price'));

        // Add to cart
        cart.push({ id, name, price });
        total += price;

        // Update bill
        $('#bill-container').append(`<p>${name} - $${price.toFixed(2)}</p>`);
        $('#total-price').text(total.toFixed(2));
    });

    // Function to handle the checkout process and print receipt
window.checkout = function () {
    if (bill.length === 0) {
        alert('No items in the bill to checkout.');
    } else {
        let total = bill.reduce((acc, item) => acc + item.price, 0);
        
        // Generate receipt HTML
        let receiptHTML = '<h3>Receipt</h3>';
        receiptHTML += '<div><strong>Items Purchased:</strong></div>';
        
        bill.forEach(function (item) {
            receiptHTML += `
                <div>
                    <span>${item.name}</span> - <span>$${item.price}</span>
                </div>
            `;
        });
        
        receiptHTML += `<div><strong>Total:</strong> $${total}</div>`;
        receiptHTML += `<div><strong>Thank you for shopping!</strong></div>`;

        // Open a new window for the receipt
        let receiptWindow = window.open('', '', 'width=600,height=400');
        receiptWindow.document.write('<html><head><title>Receipt</title></head><body>');
        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.write('</body></html>');
        receiptWindow.document.close();
        
        // Optionally, clear the bill after checkout
        bill = [];
        displayBill(); // Update bill section to reflect changes
    }
}   

    // Checkout button (for now, just reset)
    $('#checkout-button').click(function() {
        alert('Checkout complete!');
        cart = [];
        total = 0;
        $('#bill-container').empty();
        $('#total-price').text('0.00');
    });

    // Variable to track the current view (list or grid)
let currentView = 'grid'; // Default to grid view

// Function to toggle between list and grid view
window.toggleView = function(view) {
    currentView = view;  // Update current view
    loadProducts(currentCategory); // Reload the products with the selected view
}

// Function to load products based on category and current view
window.loadProducts = function (category = '') {
    currentCategory = category;  // Store the selected category
    $.ajax({
        url: 'get_products.php',
        type: 'GET',
        data: { category: category },
        success: function (response) {
            let products = JSON.parse(response);
            let productHTML = '';
            
            // Loop through products and display them based on the selected view
            products.forEach(function (product) {
                productHTML += `
                    <div class="product-card ${currentView}">
                        <p>${product.name}</p>
                        <p>$${product.price}</p>
                    </div>
                `;
            });
            $('#products').html(productHTML);  // Display products in the selected view
        },
        error: function () {
            alert('Error loading products.');
        }
    });
}

// Function to toggle between light and dark mode
function toggleMode(mode) {
    if (mode === 'dark') {
        // Apply dark mode classes
        document.body.classList.add('dark-mode');
        document.querySelectorAll('header, footer').forEach(el => el.classList.add('dark-mode'));
        document.querySelectorAll('button').forEach(el => el.classList.add('dark-mode'));
        
        // Save the theme preference in localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        // Apply light mode classes
        document.body.classList.remove('dark-mode');
        document.querySelectorAll('header, footer').forEach(el => el.classList.remove('dark-mode'));
        document.querySelectorAll('button').forEach(el => el.classList.remove('dark-mode'));

        // Save the theme preference in localStorage
        localStorage.setItem('theme', 'light');
    }
}

// Function to toggle the visibility of the dropdown
document.getElementById('themeToggleButton').addEventListener('click', function() {
    const dropdown = document.getElementById('themeDropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
});

// On page load, check if the theme is stored in localStorage
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        toggleMode(savedTheme);  // Apply the saved theme
    }
};

});
