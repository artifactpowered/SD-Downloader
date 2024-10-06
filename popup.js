

document.getElementById('sendCarrierBtn').addEventListener('click', function() {
	document.getElementById("no-doc").style.display = "none";
	document.getElementById("domain-wrong").style.display = "none";
	
    if (document.getElementById("consent").checked) {
	  
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			if (tabs.length > 0) {4
				const currentUrl = tabs[0].url;
				const hostname = new URL(currentUrl).hostname;
				console.log(hostname);
				// Check if the hostname is "studydrive.net"
				const isStudydrive = hostname.includes("studydrive.net");

				// Check if the URL contains "doc"
				const containsDoc = currentUrl.includes("doc");
				console.log("Contains Doc: " + containsDoc);
				console.log("Is Domain: " + isStudydrive);
				if (isStudydrive && containsDoc) {
					console.log('Send button clicked');


					chrome.runtime.sendMessage({ action: 'sendCarrier' }, function(response) {
						console.log('Response from background:', response);

						if (response.status === 'success') {
							const url = 'http://localhost:5000/start-capture/' + response.uuid;  // <- Update the route here
							console.log(url);
							window.open(url, '_blank');
						} else {
							alert('Failed to send carrier');
						}
					});		

					
				} else if (isStudydrive) {
					console.log("no-doc");
					document.getElementById("no-doc").style.display = "block";
				} else {
					console.log("domain-wrong");
					document.getElementById("domain-wrong").style.display = "block";
				}
			}
		});

    }
  

}); 