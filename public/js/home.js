var mobile = window.matchMedia("screen and (max-width: 1069px)");
var newsContent = document.getElementsByClassName("news-content")[0];
newsContent.onload = function() {
	const iframeDoc = newsContent.contentWindow.document;
	const height = Math.max( iframeDoc.body.scrollHeight, iframeDoc.body.offsetHeight,
		iframeDoc.documentElement.clientHeight, iframeDoc.documentElement.scrollHeight, iframeDoc.documentElement.offsetHeight );
	newsContent.style.height = height + 'px';
}
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
	let ItemHeaders = document.getElementsByClassName("news-item-header");
	for (let i = 0; i < ItemHeaders.length; i++) {
		let date = new Date(ItemHeaders[i].dataset.dateCreated);
		ItemHeaders[i].innerText = getFormattedDateTimeString(date);
	}
}

function getFormattedDateTimeString(date) {
	let displayDate;
	let check = new Date();
	if (check.toDateString() === date.toDateString()) {
		displayDate = "Today";
	} else {
		check.setDate(check.getDate() - 1);
		if (check.toDateString() === date.toDateString()) {
			displayDate = "Yesterday";
		} else {
			displayDate = dateFormat.format(date);
		}
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
	let newsContentMeta = document.getElementsByClassName(
		"news-content-metadata"
	)[0];
	let newsContentDelete = document.getElementsByClassName(
		"news-content-delete"
	)[0];
	let today = new Date();
	let yesterday = new Date(today.getDate() - 1);
	newsContent.srcdoc = body;
	newsContentMeta.innerText = `${title} - ${authorName} | ${getFormattedDateTimeString(
		new Date(createdAt)
	)}`;
	if (authorId === currUserId) {
		newsContentDelete.innerText = "DELETE";
		newsContentDelete.dataset.id = postId;
	} else newsContentDelete.innerText = "";
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
