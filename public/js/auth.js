var login = document.getElementsByClassName("login-content")[0]
var register = document.getElementsByClassName("register-content")[0]
var loginRoot = document.getElementsByClassName("login-container-container")[0]
var registerRoot = document.getElementsByClassName("register-container-container")[0]

function registerButtonClicked() {
    loginRoot.style.zIndex = "0";
    registerRoot.style.zIndex = "1";
    login.classList.add("tilt-in-rev-tl");
    register.classList.add("tilt-in-fwd-br");
    register.classList.remove("hidden");
    setTimeout(() => {
        register.classList.remove("tilt-in-fwd-br");
        login.classList.remove("tilt-in-rev-tl");
        login.classList.add("hidden");
    }, 600);
}

function loginButtonClicked() {
    registerRoot.style.zIndex = "0";
    loginRoot.style.zIndex = "1";
    register.classList.add("tilt-in-rev-br");
    login.classList.add("tilt-in-fwd-tl");
    login.classList.remove("hidden");
    setTimeout(() => {
        login.classList.remove("tilt-in-fwd-tl");
        register.classList.remove("tilt-in-rev-br");
        register.classList.add("hidden");
    }, 600);
}
