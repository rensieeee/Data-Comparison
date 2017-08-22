chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        var html=document.all[0];
        sendResponse({"html": html.innerHTML});
    }
);