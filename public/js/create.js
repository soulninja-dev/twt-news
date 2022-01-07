var converter = new showdown.Converter();
const postform = document.getElementById("post-form");
var formInputs = document.getElementsByClassName("post-form-input");
var errorToastContainer = document.getElementsByClassName(
	"error-toast-container"
)[0];
var errorToast = document.getElementsByClassName("error-toast")[0];

postform.addEventListener("submit", submitForm);

for (let i = 0; i < formInputs.length; i++) {
	formInputs[i].addEventListener(
		"keydown",
		function (event) {
			if (event.key === "Enter") {
				formInputs[i].blur();
				event.preventDefault();
				return false;
			}
			return true;
		},
		true
	);
}

function markdownInput(text) {
	let preview = document.getElementById("markdown-preview");
	let previewLabel = document.getElementById("markdown-preview-label");
	if (text.length === 0) {
		preview.classList.add("hidden");
		previewLabel.classList.add("hidden");
	} else {
		preview.classList.remove("hidden");
		previewLabel.classList.remove("hidden");
		preview.innerHTML = DOMPurify.sanitize(converter.makeHtml(text), {
			USE_PROFILES: { html: true },
			FORBID_TAGS: ['style'],
			FORBID_ATTR: ['class', 'id', 'src', 'href', 'action'],
			ALLOW_DATA_ATTR: false
		});
	}
}

function closeErrorToast() {
	errorToast.classList.remove("bounce-in-top");
	errorToastContainer.classList.add("hidden");
}

async function submitForm(event) {
	event.preventDefault();
	grecaptcha.ready(function() {
		grecaptcha.execute('6LdluvUdAAAAAHzi7lV8XpHwj5gpv1yfDEjeYVoL', { action: 'submit' }).then(createPost);
	});
}

async function createPost(token) {
	const text = document.getElementById("markdown").value;
	const title = document.getElementById("title").value;
	const subtitle = document.getElementById("subtitle").value;
	const body = DOMPurify.sanitize(converter.makeHtml(text), {
		USE_PROFILES: { html: true },
		FORBID_TAGS: ['style'],
		FORBID_ATTR: ['class', 'id', 'src', 'href', 'action'],
		ALLOW_DATA_ATTR: false
	});
	const captchaToken = token;
	console.log(JSON.stringify({ title, subtitle, body }));
	// send post req to /posts/create
	const res = await fetch("/posts/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, subtitle, body, captchaToken }),
	})
		.then(async (data) => await data.json())
		.catch(() => {
			showError("Unauthorized.");
		});
	if (!res) return;
	if (res.status === "ok") {
		window.location.href = "/posts";
	} else {
		showError(res.error);
	}
}

function showError(e = "An error occurred.") {
	document.getElementById("error-toast-text").innerText = e;
	errorToast.classList.add("bounce-in-top");
	errorToastContainer.classList.remove("hidden");
}
