var converter = new showdown.Converter();

function markdownInput(text) {
    let preview = document.getElementById("markdown-preview");
    let previewLabel = document.getElementById("markdown-preview-label");
    if (text.length === 0) {
        preview.classList.add("hidden");
        previewLabel.classList.add("hidden");
    }
    else {
        preview.classList.remove("hidden");
        previewLabel.classList.remove("hidden");
        preview.innerHTML = converter.makeHtml(text);
    }
}
