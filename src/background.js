/* PebblePadExtension V1.0 - Copyright (c) 2019 HananHindy */
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            "message": "clicked_browser_action"
        });
    });
});

// This block is new!
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "open_pdp_page") {
            data = request.data;
			
            chrome.tabs.create({
                    url: chrome.runtime.getURL("pdp.html")
                },
                function(tab) {
                    var handler = function(tabId, changeInfo) {
                        if (tabId === tab.id && changeInfo.status === "complete") {
                            chrome.tabs.onUpdated.removeListener(handler);
                            chrome.tabs.sendMessage(tabId, {
                                data: data,
								tabId: sender.tab.id
                            });
                        }
                    };

                    // in case we're faster than page load (usually):
                    chrome.tabs.onUpdated.addListener(handler);
                    // just in case we're too late with the listener:
                    chrome.tabs.sendMessage(tab.id, {
                        data: data
                    });
                }
            );
        }
    }
);