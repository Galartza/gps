let positions = [];
let timer = 0;
let distance = 0;
let interval;
let lastPosition = null;

const mapElement = document.getElementById('map');
const timerElement = document.getElementById('timer');
const distanceElement = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2 - lat1) * Math.PI/180;
    const Δλ = (lon2 - lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // En metros
}

function drawLine(lat1, lon1, lat2, lon2) {
    const deltaX = lon2 - lon1;
    const deltaY = lat2 - lat1;

    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    const length = calculateDistance(lat1, lon1, lat2, lon2);

    const line = document.createElement('div');
    line.className = 'line';
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${lat1 * 400}px`;
    line.style.left = `${lon1 * 600}px`;

    mapElement.appendChild(line);
}

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;

    interval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            if (lastPosition) {
                const dist = calculateDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
                distance += dist;
                distanceElement.textContent = Math.round(distance);

                drawLine(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
            }

            lastPosition = { latitude, longitude };
        });
    }, 3000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(interval);
    startBtn.disabled = false;
    stopBtn.disabled = true;

    alert(`Recorrido finalizado. Tiempo: ${timer} segundos, Distancia: ${Math.round(distance)} metros.`);
});
