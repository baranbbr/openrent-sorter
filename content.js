// Function to extract the last updated date from a listing
function getLastUpdatedDate(property) {
	const updatedText = property.querySelector(".timeStamp");
	if (updatedText) {
		// remove text like "Last Updated around"
		// extract the number of months/weeks/days/hours/minutes
		// make text search case insensitive
		const date = new Date();
		const time = updatedText.innerText
			.replace(/Last Updated around /i, "")
			.replace(/ ago/i, "")
			.trim();

		const timeText = parseInt(time);
		if (time.includes("week")) {
			date.setDate(date.getDate() - timeText * 7);
		} else if (time.includes("day")) {
			date.setDate(date.getDate() - timeText);
		} else if (time.includes("hour")) {
			date.setHours(date.getHours() - timeText);
		} else if (time.includes("a month")) {
			// can be "a month" - between 28 and 31 days
			date.setDate(date.getDate() - 29);
		} else if (time.includes("month")) {
			// greater than 29 days
			date.setMonth(date.getMonth() - timeText);
		} else if (time.includes("minute")) {
			date.setMinutes(date.getMinutes() - timeText);
		} // not considering years or seconds - no idea if these exist
		return date;
	}
	return new Date(0); // if no date, set to a very old date
}

function isSearchPage() {
	// find if page contains text "Your filtered search is displaying"
	const filterText = document.querySelector(".filter-intro-copy");
	if (!filterText) {
		return false;
	}
	return true;
}

// function to sort properties by the last updated date
function sortProperties() {
	observer.disconnect(); // stop observing while sorting to prevent infinite loop
	console.log("sorting properties");

	const properties = document.querySelectorAll("#property-data > a"); // contains .listing-info and .listingPic
	console.log("found properties: ", properties);

	const sortedProperties = Array.from(properties).sort((a, b) => {
		const dateA = getLastUpdatedDate(a);
		const dateB = getLastUpdatedDate(b);
		return dateB - dateA; // sort descending (newest first)
	});

	// re-append sorted properties to the page
	const container = document.querySelector("#property-data");
	sortedProperties.forEach((property) => container.appendChild(property));

	orderMetadata(container);
	observer.observe(targetNode, { childList: true, subtree: true });
}

// wait for the page to load
window.onload = function () {
	if (isSearchPage() && document.querySelector("#property-list")) {
		sortProperties();
		observer.observe(targetNode, { childList: true, subtree: true });
	}
};

// monitor page for changes
// there's an empty div at bottom that when visible loads more properties via lazy loading
const targetNode = document.querySelector("#property-list");
const observer = new MutationObserver((mutationsList, observer) => {
	console.log("HTML content has changed!", mutationsList);
	sortProperties();
});

function orderMetadata(container) {
	// these elements are the various openrent banner items
	var noProps = document.getElementById("noPropertiesFound");
	if (noProps) {
		noProps.remove();
		container.appendChild(noProps);
	}

	var tiredOfChecking = document.getElementById("pb-tiredOfCheckingBack");
	if (tiredOfChecking) {
		tiredOfChecking.remove();
		container.appendChild(tiredOfChecking);
	}

	var prevLet = document.getElementById("pb-toggleLetProperties");
	if (prevLet) {
		prevLet.remove();
		container.appendChild(prevLet);
	}
}
