let requestCounts = {};

chrome.tabs.onActivated.addListener(({ tabId }) => {
  updateBadge(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    requestCounts[tabId] = 0;
    updateBadge(tabId);
  }
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const { tabId, statusCode } = details;

    if (tabId >= 0 && statusCode >= 200 && statusCode < 300) {
      requestCounts[tabId] = (requestCounts[tabId] || 0) + 1;
      updateBadge(tabId);
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.tabs.onRemoved.addListener((tabId) => {
  delete requestCounts[tabId];
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, tabId } = message;

  if (type === 'getCount') {
    const count = requestCounts[tabId] || 0;
    sendResponse({ count: count });
  } else if (type === 'resetCount') {
    requestCounts[tabId] = 0;
    updateBadge(tabId);
    sendResponse({ success: true });
  }
  return true;
});

function updateBadge(tabId) {
  const count = requestCounts[tabId] || 0;
  chrome.action.setBadgeText({ text: count.toString(), tabId: tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#4688F1', tabId: tabId });
}
