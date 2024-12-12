// Initializing an empty product list
let products = [
    {
        id: "1",
        name: "Men's Plain T-shirt Black Bolf 2005",
        image: "/img/Product-1.jpg",
        quantity: "10",
        price: 9.99,
    },
    {
        id: "2",
        name: "Men's Kangaroo Hoodie Graphite Bolf MB001",
        image: "/img/Product-2.jpg",
        quantity: 1,
        price: 13.99,
    },
    {
        id: "3",
        name: "Men's Elegant Long Sleeve Shirt Black Bolf 4711",
        image: "/img/Product-3.jpg",
        quantity: 1,
        price: 19.99,
    },
    {
        id: "4",
        name: "Men's Sweatpants Claret Bolf XW01",
        image: "/img/Product-4.jpg",
        quantity: 1,
        price: 12.99,
    },
    {
        id: "5",
        name: "Men’s Balaclava Cap Black Bolf YN901",
        image: "/img/Product-5.jpg",
        quantity: 1,
        price: 9.99,
    },
    {
        id: "6",
        name: "Men’s Warm Winter Beanie Black Bolf 386008",
        image: "/img/Product-6.jpg",
        quantity: 1,
        price: 9.99,
    },
    {
        id: "7",
        name: "Men’s Set of Bracelets Black Bolf TT1138-3P 3 PACK",
        image: "/img/Product-7.jpg",
        quantity: 1,
        price: 12.99,
    },
    {
        id: "8",
        name: "Men’s Straped Necklace Black Bolf TT7126",
        image: "/img/Product-8.jpg",
        quantity: 1,
        price: 12.99,
    },
    {
        id: "9",
        name: "Men's Camo Wristwatch Green Bolf 3261",
        image: "/img/Product-9.jpg",
        quantity: 1,
        price: 24.99,
    },
    {
        id: "10",
        name: "Men's Elegant Slim Tie Grey Bolf K001",
        image: "/img/Product-10.jpg",
        quantity: 1,
        price: 9.99,
    },
    {
        id: "11",
        name: "Men's Elegant Bow Tie Black Bolf M001",
        image: "/img/Product-11.jpg",
        quantity: 1,
        price: 9.99,
    },
    {
        id: "12",
        name: "Men’s Leather Belt Black Bolf 019",
        image: "/img/Product-12.jpg",
        quantity: 1,
        price: 12.99,
    },
];

// Event listener for form submission
document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get product data from the form inputs
    const productId = document.getElementById("productId").value;
    const productName = document.getElementById("productName").value;
    const productImage = document.getElementById("productImage").files[0];
    const productQuantity = document.getElementById("productQuantity").value;
    const productPrice = document.getElementById("productPrice").value;

    // Check if an image is selected
    const productImageUrl = productImage
        ? URL.createObjectURL(productImage)
        : "";

    // If editing, find the product and update it
    if (productId) {
        const product = products.find((p) => p.id === productId);
        product.name = productName;
        product.image = productImageUrl;
        product.quantity = productQuantity;
        product.price = productPrice;
    } else {
        // Add a new product
        const newProduct = {
            id: Date.now().toString(),
            name: productName,
            image: productImageUrl,
            quantity: productQuantity,
            price: productPrice,
        };
        products.push(newProduct);
    }

    // Reset the form
    document.getElementById("productForm").reset();
    document.getElementById("submitButton").textContent = "Add Product";
    document.getElementById("productId").value = "";

    // Display the updated products in the table
    displayProducts();
});

// Function to display products in the table
function displayProducts() {
    const productTableBody = document.getElementById("productTableBody");
    productTableBody.innerHTML = ""; // Clear the table before rendering new rows

    products.forEach((product) => {
        const row = document.createElement("tr");

        // Add product data to the row
        row.innerHTML = `
            <td>${product.name}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.quantity}</td>
            <td>$${product.price}</td>
            <td>
                <button class="edit-btn" onclick="editProduct('${product.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        `;

        productTableBody.appendChild(row);
    });
}

// Function to edit a product
function editProduct(productId) {
    const product = products.find((p) => p.id === productId);
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productQuantity").value = product.quantity;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("submitButton").textContent = "Update Product";
}

// Function to delete a product
function deleteProduct(productId) {
    // Remove the product from the array
    products = products.filter((p) => p.id !== productId);

    // Update the table with the new list of products
    displayProducts();
}

// Function to update the quantity of a product
function updateQuantity(productId, newQuantity) {
    const product = products.find((p) => p.id === productId);
    product.quantity = newQuantity;
    displayProducts(); // Update table after quantity change
}

// Initial display of products when the page loads
displayProducts();
