var login = document.getElementsByClassName("form-content")[0]
var register = document.getElementsByClassName("form-content")[1]
var loginRoot = document.getElementsByClassName("login-container")[0]
var registerRoot = document.getElementsByClassName("register-container")[0]
var formInputs = document.getElementsByClassName("form-input");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

loginForm.addEventListener("submit", submitLoginForm);
registerForm.addEventListener("submit", submitRegisterForm);

for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            formInputs[i].blur();
            event.preventDefault();
            return false;
        }
        return true;
    }, true);
}

function validateInput(ele) {
    if (ele.classList.contains("name")) {
        if (ele.value.length > 50) {
            ele.labels[0].innerHTML = "Name can not be more than 50 characters";
            ele.labels[0].classList.remove("hidden");
        } else ele.labels[0].classList.add("hidden");
    }
    else if (ele.classList.contains("email")) {
        let emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
        if (!emailRegex.test(ele.value)) {
            ele.labels[0].innerHTML = "Please enter a valid email";
            ele.labels[0].classList.remove("hidden");
        } else ele.labels[0].classList.add("hidden");
    }
}

function remake(ele){
    setTimeout(()=> {
        let val = ele.value;
        let id = ele.id;
        ele.outerhtml = ele.outerhtml;
        document.getElementById(id).value = val;
        return true;
    });
}

function registerRedirect() {
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

function loginRedirect() {
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

function submitLoginForm(event) {
    event.preventDefault();
}

function submitRegisterForm(event) {
    event.preventDefault();
}
