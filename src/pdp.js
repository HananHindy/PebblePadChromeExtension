/* PebblePadExtension V1.0 - Copyright (c) 2019 HananHindy */
var onMessageHandler = function(message) {
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);
    console.log('Adding PDP data');
	tabId = message.tabId;
    //console.log(message.data);
    Sunburst()
        .data((message.data))
        .size('size')
        .color('color')
        .excludeRoot(true)
        .showLabels(true)
        .width(1024)
        .height(768)
        .onClick(function(e) {
            if (e && e.url) {
				chrome.tabs.update(
						tabId, 
						 {
							active: true,
							url: e.url
						  });    
            }
        })
		.tooltipTitle(function(e) {
			if(e && e.tooltip) {
				return e.tooltip;
			}
        })
        (document.getElementById('chart'));

};

chrome.runtime.onMessage.addListener(onMessageHandler);