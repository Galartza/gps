const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const positions = [];

navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    positions.push([latitude, longitude]);

    const polyline = L.polyline(positions, { color: 'blue' }).addTo(map);
    map.setView([latitude, longitude]);
}, (error) => console.error(error), {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
});
