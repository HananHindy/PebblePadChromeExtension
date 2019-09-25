/* PebblePadExtension V1.0 - Copyright (c) 2019 HananHindy */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            var pageUrl = window.location.toString()
            var index = pageUrl.indexOf("&pageId");
            pageUrl = pageUrl.substring(0, index) + "&pageId=";

            var colors_domains = ['#d3bedd', '#9cdcf8', '#a7d4d9', '#bac9e6'];
			var colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9'];
			var colors_counter = 0;
			
            var pdpElements = document.getElementsByTagName("navigation-item");
            var counter = pdpElements.length;
			
            var pdpChartData = {};
            pdpChartData['name'] = "PDP";
            pdpChartData['children'] = [];
			
			var pdpDomains = [];
			var domainsCounter = -1;
           			
            for (var i = 0; i < counter; i++) {
                var tempJSON = JSON.parse(pdpElements[i].attributes["item-data"].value);
                var childrenCount = tempJSON["Children"].length;

                var pageTitle = tempJSON["PageTitle"];
                var pageID = tempJSON["PageId"];

                var tempObject = {
                    name: pageTitle,
					tooltip: pageTitle,
                    color: domainsCounter >= 0 ? colors_domains[domainsCounter] : colors[colors_counter],
                    //url: pageUrl + pageID,
                    children: []
                };

                if (childrenCount > 0) {
                    for (var j = 0; j < childrenCount; j++) {
                        var pageTitle = tempJSON["Children"][j]["PageTitle"];
                        var pageID = tempJSON["Children"][j]["PageId"];

                        var tempChild = {
                            name: j+1,
							tooltip: pageTitle,
                            color: domainsCounter >= 0 ? colors_domains[domainsCounter] : colors[colors_counter],
                            url: pageUrl + pageID,
							size:1,
                            children: []
                        };
						
                        tempObject.children.push(tempChild);
                    }
					
					if(domainsCounter >= 0) {
						pdpDomains[domainsCounter]['children'].push(tempObject);
					}
					else {
						pdpChartData['children'].push(tempObject);
						colors_counter++;
					}
					
                } else if (pageTitle.indexOf('Domain') != -1) {
					domainsCounter++;
					var domain = {};
					domain['name'] = pageTitle.replace("Domain ", "");
					domain['tooltip'] = pageTitle;
					domain['color'] = domainsCounter >= 0 ? colors_domains[domainsCounter] : "#99ccff";
					domain['url'] = pageUrl + pageID;
					domain['children'] = [];
					pdpDomains.push(domain);
                }
            }
			
			if(domainsCounter >= 0) {
				pdpChartData['children'] = pdpDomains;
			}
            
			if(pdpChartData['children'].length > 0)
			{
				chrome.runtime.sendMessage({
					"message": "open_pdp_page",
					"data": pdpChartData
				});
			}
        }
    }
);