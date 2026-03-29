const reader = new Html5Qrcode("camera");
let scannerOn = false;

// Elements
const btn = document.getElementById('btn');
const mapContainer = document.getElementById('mapContainer');
const marker = document.getElementById('marker');

// Toggle scanner on/off
function toggleScanner() {
    scannerOn = !scannerOn;
    if (scannerOn) {
        startScanner();
        mapContainer.style.display = "none";
        btn.innerText = "CANCEL";
    } else {
        stopScanner();
        mapContainer.style.display = "block";
        btn.innerText = "SCAN";
    }
}

// Start QR scanner
function startScanner() {
    reader.start(
        { facingMode: "environment" },
        {},
        function (text) {
            try {
                const data = JSON.parse(text);

                // Inventory QR: has name, price, in_store
                if (data.name && data.price !== undefined && data.in_store !== undefined) {
                    displayInventoryItem(data);
                }
                // Map QR: has top and left
                else if (data.top !== undefined && data.left !== undefined) {
                    showMarkerAt(data.top, data.left);
                }

                toggleScanner();
            } catch (err) {
                console.error("Invalid QR JSON", err);
            }
        }
    ).catch(err => console.error(err));
}

// Stop QR scanner
function stopScanner() {
    reader.stop();
}

// Show marker on map
function showMarkerAt(top, left) {
    marker.style.top = top;
    marker.style.left = left;
}

// Display inventory item in HTML
function displayInventoryItem(data) {
    const container = document.getElementById('inventory');

    const nameP = document.createElement('p');
    nameP.textContent = `Name: ${data.name}`;

    const inStoreP = document.createElement('p');
    inStoreP.textContent = `In Store: ${data.in_store ? "Yes" : "No"}`;

    const priceP = document.createElement('p');
    priceP.textContent = `Price: €${data.price}`;

    container.appendChild(nameP);
    container.appendChild(inStoreP);
    container.appendChild(priceP);

    // horizontal separator between items
    const hr = document.createElement('hr');
    container.appendChild(hr);
}