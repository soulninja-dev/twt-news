var converter = new showdown.Converter();
const postform = document.getElementById("post-form");

postform.addEventListener("submit", submitForm);

function markdownInput(text) {
	let preview = document.getElementById("markdown-preview");
	let previewLabel = document.getElementById("markdown-preview-label");
	if (text.length === 0) {
		preview.classList.add("hidden");
		previewLabel.classList.add("hidden");
	} else {
		preview.classList.remove("hidden");
		previewLabel.classList.remove("hidden");
		preview.innerHTML = converter.makeHtml(text);
	}
}

async function submitForm(event) {
	event.preventDefault();
	const text = document.getElementById("markdown").value;
	const title = document.getElementById("title").value;
	const subtitle = document.getElementById("subtitle").value;
	const body = converter.makeHtml(text);
	console.log(`title: ${title}\tsubtitle:${subtitle}\tbody:${body}`);
	// send post req to /posts/create
	const res = await fetch("/posts/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, subtitle, body }),
	}).then((data) => data.json());

	if (res.status === "ok") {
		window.location.href = "/posts";
	} else {
		// implement error
		console.log("errors errors");
	}
}
