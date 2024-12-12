var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";
function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px";
    } else {
        MenuItems.style.maxHeight = "0px";
    }
}

const loginButton = document.getElementById("Loginbtn");

loginButton.addEventListener("click", function () {
    console.log("Đang chuyển qua trang login...");
    window.location.href = "../LoginForm/Login.html";
});

function logout() {
    // Chuyển hướng người dùng về trang index.html
    window.location.href = "index.html";
}

// // Lấy phần tử hình ảnh logo
// const logo = document.querySelector(".logo img");

// // Kiểm tra trạng thái đăng nhập của người dùng
// const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Kiểm tra trạng thái đăng nhập trong localStorage

// // Thêm sự kiện click vào hình ảnh
// logo.addEventListener("click", () => {
//     // Nếu người dùng đã đăng nhập, chuyển đến trang home sau khi đăng nhập
//     if (isLoggedIn) {
//         window.location.href = "Index-AL.html"; // Thay đổi đường dẫn nếu cần (ví dụ "/home" hoặc "/user-dashboard")
//     } else {
//         window.location.href = "Index.html"; // Chuyển về trang chủ không yêu cầu đăng nhập
//     }
// });
