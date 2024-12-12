// Initialize an empty user list
let users = [
    {
        id: "1",
        name: "admin",
        email: "admin@example.com",
    },
    {
        id: "2",
        name: "user",
        email: "user@example.com",
    },
];

// Function to render users in the table
function renderUsers() {
    const userTable = document
        .getElementById("userTable")
        .getElementsByTagName("tbody")[0];
    userTable.innerHTML = ""; // Clear the table body

    users.forEach((user) => {
        const row = userTable.insertRow();
        row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser('${user.id}')" class="btn">Edit</button>
        <button onclick="deleteUser('${user.id}')" class="btn">Delete</button>
      </td>
    `;
    });
}

// Function to handle add user form submission
document
    .getElementById("addUserForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const useremail = document.getElementById("useremail").value;

        // Add new user to the users array
        const newUser = {
            id: Date.now().toString(), // Unique ID based on timestamp
            name: username,
            email: useremail,
        };

        users.push(newUser);
        renderUsers();

        // Reset the form
        document.getElementById("addUserForm").reset();
    });

// Function to handle editing a user
function editUser(userId) {
    const user = users.find((u) => u.id === userId);

    // Pre-fill the form with the user's data
    document.getElementById("username").value = user.name;
    document.getElementById("useremail").value = user.email;

    // Change the form submission to update the user instead of adding a new one
    document.getElementById("addUserForm").onsubmit = function (event) {
        event.preventDefault();
        const updatedUser = {
            id: user.id, // Keep the same ID
            name: document.getElementById("username").value,
            email: document.getElementById("useremail").value,
        };

        // Update the user data
        const userIndex = users.findIndex((u) => u.id === user.id);
        users[userIndex] = updatedUser;
        renderUsers();

        // Reset form and revert to the add user behavior
        document.getElementById("addUserForm").reset();
        document.getElementById("addUserForm").onsubmit = function (event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const useremail = document.getElementById("useremail").value;

            const newUser = {
                id: Date.now().toString(), // Unique ID based on timestamp
                name: username,
                email: useremail,
            };
            users.push(newUser);
            renderUsers();
            document.getElementById("addUserForm").reset();
        };
    };
}

// Function to handle deleting a user
function deleteUser(userId) {
    const confirmation = confirm("Are you sure you want to delete this user?");
    if (confirmation) {
        // Remove the user from the array using ID
        users = users.filter((u) => u.id !== userId);
        renderUsers();
    }
}

// Render users when the page loads
renderUsers();
