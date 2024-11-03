document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById('counter');
    const resetButton = document.getElementById('resetButton');
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
  
      chrome.runtime.sendMessage({ type: 'getCount', tabId: tabId }, (response) => {
        counterElement.textContent = `Requests: ${response.count}`;
      });
    });
  });
  