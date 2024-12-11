const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

// Add event listener for Register link to switch to Registration form
registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});

// Add event listener for Login link to switch back to Login form
loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

// Add event listener for Login popup button to show Login/Register popup
btnPopup.addEventListener("click", () => {
    wrapper.classList.add("active-popup");
});

// Add event listener for Close icon to hide Login/Register popup
iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
});

// Add event listener for Registration form submission to move back to Login
const registerForm = document.querySelector(".form-box.register form");
registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent actual form submission
    wrapper.classList.remove("active"); // Switch back to Login form
});

// Xử lý Đăng ký
document
    .getElementById("register-form")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Đăng ký thành công!") {
                    alert("Đăng ký thành công! Vui lòng đăng nhập.");
                    showLoginForm();
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

// Xử lý Đăng nhập
document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            // Gửi yêu cầu đăng nhập tới server
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            // Kiểm tra phản hồi từ server
            try {
                const jsonResponse = await response.json();
                if (response.ok) {
                    window.location.href = jsonResponse.redirectUrl;
                } else {
                    alert(jsonResponse.message);
                }
            } catch (error) {
                alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
            }
        } catch (error) {
            console.error("Error:", error);
            console.log("Error:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
    });
