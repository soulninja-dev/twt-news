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

function submitForm(event) {
	event.preventDefault();
	const text = document.getElementById("markdown").value;
	console.log(converter.makeHtml(text));
}
