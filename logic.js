function searchWikipedia(word) {
  const query = word.selectionText;
  chrome.tabs.create({url: "https://en.wikipedia.org/wiki/" + query});
  };
  chrome.contextMenus.create({
  title: "Ask Jeeves?",
  contexts:["selection"],
  onclick: searchWikipedia
  });