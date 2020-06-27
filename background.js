chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3ddad7'}, function() {
        console.log("gg");
    });
    chrome.storage.sync.set({tasks: ['Hello']}, function() {
        console.log("tasks");
    });
    chrome.storage.sync.set({complete: ['Hello']}, function() {
        console.log("complete");
    });
    chrome.storage.sync.set({images: ['200.png']}, function() {
        console.log("images");
    });
    chrome.storage.sync.set({sound: true}, function() {
        console.log("sound");
    });
    chrome.storage.sync.set({total: 0}, function() {
        console.log("total");
    })
});
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {schemes: ['http', 'https']},
            }),
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});