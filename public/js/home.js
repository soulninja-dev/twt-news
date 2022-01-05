var mobile = window.matchMedia("screen and (max-width: 1069px)");
const dateFormat = new Intl.DateTimeFormat([], {
	year: "numeric",
	month: "numeric",
	day: "numeric",
});
const timeFormat = new Intl.DateTimeFormat([], {
	hour: "numeric",
	minute: "numeric",
});
let firstNews = document.getElementsByClassName("news-item-view-button")[0];
if (firstNews) {
	firstNews.click();
	if (mobile.matches) toggleCollapseNewsItem();
}

setTimeout(displayLocalTimes);

function displayLocalTimes() {
	let today = new Date();
	let yesterday = new Date(today.getDate() - 1);
	let displayDate;
	let ItemHeaders = document.getElementsByClassName("news-item-header");
	for (let i = 0; i < ItemHeaders.length; i++) {
		let date = new Date(ItemHeaders[i].dataset.dateCreated);
		ItemHeaders[i].innerHTML = getFormattedDateTimeString(date, today, yesterday);
	}
}

function getFormattedDateTimeString(date, today, yesterday) {
	let displayDate;
	if (today.toDateString() === date.toDateString()) {
		displayDate = "Today";
	} else if (yesterday.toDateString() === date.toDateString()) {
		displayDate = "Yesterday";
	} else {
		displayDate = dateFormat.format(date);
	}
	return displayDate + " | " + timeFormat.format(date);
}

function toggleCollapseNewsItem() {
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
		news.style.opacity = "0";
		setTimeout(() => {
			news.style.transition = "opacity .4s ease";
			news.style.opacity = "1";
			setTimeout(() => (news.style.transition = "none"), 400);
		}, 300);
	}
}

function newsItemClicked(
	title,
	authorName,
	authorId,
	body,
	createdAt,
	currUserId,
	postId
) {
	let newsContent = document.getElementsByClassName("news-content")[0];
	let newsContentMeta = document.getElementsByClassName(
		"news-content-metadata"
	)[0];
	let newsContentDelete = document.getElementsByClassName(
		"news-content-delete"
	)[0];
	let today = new Date();
	let yesterday = new Date(today.getDate() - 1);
	newsContent.innerHTML = body;
	newsContentMeta.innerHTML = `${title} - ${authorName} | ${getFormattedDateTimeString(new Date(createdAt), today, yesterday)}`;
	if (authorId === currUserId) {
		newsContentDelete.innerHTML = "DELETE";
		newsContentDelete.dataset.id = postId;
	} else newsContentDelete.innerHTML = "";
	if (mobile.matches) {
		toggleCollapseNewsItem();
	}
}

function gotPageInput() {
	let pageInput = document.getElementById("pagination-page-input");
	let val = +pageInput.value;
	if (page === val) return pageInput.blur();
	if (Number.isInteger(val) && 1 <= val && val <= maxPages) {
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("page", val.toString());
		window.location.search = urlParams;
	} else {
		pageInput.value = page.toString();
		pageInput.blur();
	}
}

function pageNext() {
	if (nextPage) {
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("page", nextPage);
		window.location.search = urlParams;
	}
}

function pagePrev() {
	if (prevPage) {
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("page", prevPage);
		window.location.search = urlParams;
	}
}

async function deletePost(id) {
	const res = await fetch(`/posts/${id}`, {
		method: "DELETE",
	}).then((data) => data.json());
	console.log(res);
	location.reload();
}

function closeUserControl() {
	let userControl = document.getElementsByClassName("user-control-dropdown")[0];
	userControl.classList.add("hidden");
}

function showUserControl() {
	let userControl = document.getElementsByClassName("user-control-dropdown")[0];
	userControl.classList.remove("hidden");
}

async function logoutUser() {
	await fetch("/auth/logout");
	location.reload();
}
