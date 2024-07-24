document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header');

    function loadHeader() {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                updateTotalPriceInNav();
            });
    }

    loadHeader();

    const addProductButton = document.getElementById('add-product-btn');
    const addProductForm = document.getElementById('add-product-form');
    const productForm = document.getElementById('add-product-form');
    const productContainer = document.querySelector('#products .product-list');
    const homeProductContainer = document.getElementById('home-products');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceContainer = document.getElementById('total-price');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    if (totalPriceContainer) {
        totalPriceContainer.textContent = `$${totalPrice.toFixed(2)}`;
    }

    if (cartItemsContainer) {
        displayCartItems();
    }

    if (productContainer) {
        displayProducts();
    }

    if (homeProductContainer) {
        displayProducts(homeProductContainer);
    }

    addProductButton.addEventListener('click', function() {
        addProductForm.classList.toggle('hidden');
    });

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const photo = document.getElementById('product-photo').files[0];
        const type = document.getElementById('product-type').value;

        if (!name || isNaN(price) || !photo || !type) {
            alert('Please fill out all fields.');
            return;
        }

        const product = {
            name: name,
            price: price,
            photo: URL.createObjectURL(photo), // Create a URL for the photo
            type: type
        };

        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        displayProducts();
        displayProducts(homeProductContainer);
        addProductForm.classList.add('hidden');
        productForm.reset();
    });

    function displayProducts(container = productContainer) {
        if (container) {
            container.innerHTML = '';
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.photo}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Type: ${product.type}</p>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn">Add to Cart</button>
                `;
                productElement.querySelector('.add-to-cart-btn').addEventListener('click', function() {
                    addToCart(product);
                });
                container.appendChild(productElement);
            });
        }
    }

    function addToCart(product) {
        const cartItem = {
            name: product.name,
            price: product.price
        };

        cartItems.push(cartItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        totalPrice += product.price;
        if (totalPriceContainer) {
            totalPriceContainer.textContent = `$${totalPrice.toFixed(2)}`;
        }

        if (cartItemsContainer) {
            updateCartPage(cartItem);
        }

        updateTotalPriceInNav();
    }

    function updateCartPage(cartItem) {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <span   class="title-remove" >${cartItem.name}</span>
            <span>$${cartItem.price.toFixed(2)}</span>
            <button class="remove-button">Remove</button>
        `;

        cartItemElement.querySelector('.remove-button').addEventListener('click', function() {
            removeCartItem(cartItem, cartItemElement);
        });

        cartItemsContainer.appendChild(cartItemElement);
    }

    function removeCartItem(cartItem, cartItemElement) {
        cartItems = cartItems.filter(item => item !== cartItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        totalPrice -= cartItem.price;
        if (totalPriceContainer) {
            totalPriceContainer.textContent = `$${totalPrice.toFixed(2)}`;
        }

        cartItemElement.remove();
        updateTotalPriceInNav();
    }

    function displayCartItems() {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cartItems.forEach(item => updateCartPage(item));
        }
    }

    function updateTotalPriceInNav() {
        const totalPriceElement = document.getElementById('nav-total-price');
        const totalPriceContainer = document.getElementById('total-price');
        const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

        if (totalPriceElement) {
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }

        if (totalPriceContainer) {
            totalPriceContainer.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }

    updateTotalPriceInNav();
});

// Function to add a product to localStorage
function addProduct(name, price, photo, type, place) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, price, photo, type, place });
    localStorage.setItem('products', JSON.stringify(products));
}

// Event listener for the add product button
document.getElementById('add-product-btn').addEventListener('click', function() {
    document.getElementById('add-product-form').classList.remove('hidden');
});

document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const photo = URL.createObjectURL(document.getElementById('product-photo').files[0]);
    const type = document.getElementById('product-type').value;
    const place = document.getElementById('product-place').value;

    addProduct(name, price, photo, type, place);
    alert('Product added successfully!');
});
// Event delegation to handle clicks on "Add to Cart" buttons
document.getElementById('home-products').addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        const photo = e.target.getAttribute('data-photo');
        const type = e.target.getAttribute('data-type');
        const place = e.target.getAttribute('data-place');

        // Add to cart logic
        addToCart(name, price, photo, type, place);
        alert(`${name} added to cart!`);
    }
});

function addToCart(name, price, photo, type, place) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price, photo, type, place });
    localStorage.setItem('cart', JSON.stringify(cart));
}

