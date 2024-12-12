// Initializing an empty product list
let products = [];

// Event listener for form submission
document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get product data from the form inputs
    const productId = document.getElementById("productId").value;
    const productName = document.getElementById("productName").value;
    const productImage = document.getElementById("productImage").files[0];
    const productQuantity = document.getElementById("productQuantity").value;

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
    } else {
        // Add a new product
        const newProduct = {
            id: Date.now().toString(),
            name: productName,
            image: productImageUrl,
            quantity: productQuantity,
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
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>
                <input type="number" value="${product.quantity}" min="0" onchange="updateQuantity('${product.id}', this.value)">
            </td>
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
