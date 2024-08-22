let positions = [];
let timer = 0;
let distance = 0;
let interval;
let lastPosition = null;
let map;
let polyline;

const timerElement = document.getElementById('timer');
const distanceElement = document.getElementById('distance');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 15,
    });

    polyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    polyline.setMap(map);
}

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

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;

    interval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const latLng = new google.maps.LatLng(latitude, longitude);
                map.setCenter(latLng);

                if (lastPosition) {
                    const dist = calculateDistance(lastPosition.lat, lastPosition.lng, latitude, longitude);
                    distance += dist;
                    distanceElement.textContent = Math.round(distance);

                    const path = polyline.getPath();
                    path.push(latLng);
                    polyline.setPath(path);
                }

                lastPosition = { lat: latitude, lng: longitude };
            }, (error) => {
                console.error('Error obteniendo la ubicación: ', error);
            });
        } else {
            alert('Geolocalización no soportada por este navegador.');
        }
    }, 3000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(interval);
    startBtn.disabled = false;
    stopBtn.disabled = true;

    alert(`Recorrido finalizado. Tiempo: ${timer} segundos, Distancia: ${Math.round(distance)} metros.`);
});

window.onload = initMap;
