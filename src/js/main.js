// Inicializa el mapa centrado en Chile
var map = L.map('map').setView([-30.0, -71.0], 4); // Coordenadas aproximadas de Chile

// Capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Array de ubicaciones con marcadores para diferentes regiones de Chile
var locations = [
    { coords: [-33.4489, -70.6693], region: 'Santiago' }, // Santiago
    { coords: [-33.0472, -71.6127], region: 'Valparaíso' }, // Valparaíso
    { coords: [-36.8219, -73.0444], region: 'Concepción' }, // Concepción
    { coords: [-40.2402, -73.1190], region: 'Puerto Montt' }, // Puerto Montt
    { coords: [-39.2760, -72.2280], region: 'Villarrica' }, // Villarrica
    { coords: [-37.4690, -72.7060], region: 'Nacimiento' }, // Nacimiento
    { coords: [-33.0154, -71.5500], region: 'Viña del Mar' } // Viña del Mar
];

// Agregar marcadores al mapa
locations.forEach(function(location) {
    L.marker(location.coords).addTo(map)
        .bindPopup('Sede (' + location.region + ')');
});