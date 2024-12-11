var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";
function menutoggle(){
    if(MenuItems.style.maxHeight == "0px")
    {
        MenuItems.style.maxHeight = "200px";
    }
    else
    {
        MenuItems.style.maxHeight = "0px"
    }
}

const loginButton = document.getElementById("Loginbtn");

loginButton.addEventListener("click", function(){
    console.log("Đang chuyển qua trang login...");
    window.location.href = "../LoginForm/Login.html";
})