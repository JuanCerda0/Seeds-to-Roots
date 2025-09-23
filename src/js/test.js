// Inicializa el mapa
var map = L.map('map').setView([-33.4489, -70.6693], 10); // Coordenadas de Santiago

// Capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


// Marcador Santiago
var Msantiago = L.marker([-33.4489, -70.6693]).addTo(map)
    .bindPopup('Sede 1')
    .openPopup();