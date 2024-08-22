let positions = [];
let timer = 0;
let distance = 0;
let interval;
let lastPosition = null;

const mapElement = document.getElementById('map');
const timerElement = document.getElementById('timer');
const distanceElement = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    interval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            positions.push({ latitude, longitude });

            if (lastPosition) {
                const deltaX = latitude - lastPosition.latitude;
                const deltaY = longitude - lastPosition.longitude;
                distance += Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 111320; // Convert degrees to meters
                distanceElement.textContent = Math.round(distance);
            }

            lastPosition = { latitude, longitude };

            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.top = `${latitude * 400}px`;  // Adjust to match image scaling
            marker.style.left = `${longitude * 600}px`; // Adjust to match image scaling
            mapElement.appendChild(marker);
        });
    }, 3000);
});
