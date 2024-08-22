const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let positions = [];
let interval;
let timer = 0;
let distance = 0;
let lastPosition = null;

const timerElement = document.getElementById('timer');
const distanceElement = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // En metros
}

function startTracking() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    positions = [];
    distance = 0;
    timer = 0;
    lastPosition = null;
    timerElement.textContent = timer;
    distanceElement.textContent = distance;

    interval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);

    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        const latLng = [latitude, longitude];
        positions.push(latLng);

        if (positions.length > 1) {
            const polyline = L.polyline(positions, { color: 'blue' }).addTo(map);

            if (lastPosition) {
                const dist = calculateDistance(lastPosition.lat, lastPosition.lng, latitude, longitude);
                distance += dist;
                distanceElement.textContent = Math.round(distance);
            }

            map.setView(latLng);
        }

        lastPosition = { lat: latitude, lng: longitude };
    }, (error) => console.error(error), {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    });
}

function stopTracking() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearInterval(interval);
}

startBtn.addEventListener('click', startTracking);
stopBtn.addEventListener('click', stopTracking);
