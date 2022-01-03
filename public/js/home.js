var mobile = window.matchMedia("screen and (max-width: 900px)");
var currPage = 1;

function collapseNewsItem() {
	let items =
		document.getElementsByClassName("news-items-container")[0] || false;
	let news_container =
		document.getElementsByClassName("news-content-container")[0] || false;
	if (items.classList.contains("collapsed")) {
		items.classList.remove("collapsed");
		news_container.classList.remove("items-collapsed");
	} else {
		items.classList.add("collapsed");
		news_container.classList.add("items-collapsed");
	}
	if (!mobile.matches) {
		let news = document.getElementsByClassName("news-content")[0];
		news.style.opacity = '0';
		setTimeout(() => {
			news.style.transition = "opacity .4s ease";
			news.style.opacity = '1';
			setTimeout(() => (news.style.transition = "none"), 400);
		}, 300);
	}
}

function newsItemClicked(body) {
	let newsContent = document.getElementsByClassName(
		"news-content"
	)[0];
	newsContent.innerHTML = body;
	if (mobile.matches) {
		collapseNewsItem();
	}
}

function gotPageInput() {
	let pageInput = +document.getElementById("pagination-page-input").value;
	if (Number.isInteger(pageInput) && 1 <= pageInput && pageInput <= 20) {
		currPage = pageInput;
		return true;
	}
	return false;
}

function updatePageInputValue() {
	document.getElementById("pagination-page-input").value = `${currPage}`;
}

function pageNext() {
	currPage = Math.min(20, currPage+1);
	updatePageInputValue();
}

function pagePrev() {
	currPage = Math.max(1, currPage-1);
	updatePageInputValue();
}
