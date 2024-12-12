// Initialize an empty user list
let users = [];

// Event listener for form submission
document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get user data from the form inputs
    const userId = document.getElementById("userId").value;
    const userName = document.getElementById("userName").value;
    const userEmail = document.getElementById("userEmail").value;
    const userPhone = document.getElementById("userPhone").value;

    // Check if we are editing or adding a new user
    if (userId) {
        // Editing an existing user
        const user = users.find((u) => u.id === userId);
        user.name = userName;
        user.email = userEmail;
        user.phone = userPhone;
    } else {
        // Adding a new user
        const newUser = {
            id: Date.now().toString(), // Unique ID based on current timestamp
            name: userName,
            email: userEmail,
            phone: userPhone,
        };
        users.push(newUser);
    }

    // Reset the form
    document.getElementById("userForm").reset();
    document.getElementById("submitButton").textContent = "Add User";
    document.getElementById("userId").value = ""; // Clear hidden ID field

    // Display the updated users in the table
    displayUsers();
});

// Function to display users in the table
function displayUsers() {
    const userTableBody = document.getElementById("userTableBody");
    userTableBody.innerHTML = ""; // Clear the table before rendering new rows

    users.forEach((user) => {
        // Create a new row for each user
        const row = document.createElement("tr");

        // Add user data to the row
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button class="edit-btn" onclick="editUser('${user.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;

        // Append the row to the table body
        userTableBody.appendChild(row);
    });
}

// Function to edit a user
function editUser(userId) {
    const user = users.find((u) => u.id === userId);
    document.getElementById("userId").value = user.id;
    document.getElementById("userName").value = user.name;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userPhone").value = user.phone;
    document.getElementById("submitButton").textContent = "Update User";
}

// Function to delete a user
function deleteUser(userId) {
    // Remove the user from the users array
    users = users.filter((u) => u.id !== userId);

    // Update the table with the new list of users
    displayUsers();
}

// Initial display of users when the page loads
displayUsers();
