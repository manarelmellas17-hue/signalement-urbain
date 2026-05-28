let map;

function initMap(lat = 35.7595, lng = -5.8340) {
  map = L.map('map').setView([lat, lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

function afficherSurCarte(signalements) {
  if (!map) initMap();
  signalements.forEach(s => {
    if (s.localisation?.latitude && s.localisation?.longitude) {
      L.marker([s.localisation.latitude, s.localisation.longitude])
        .addTo(map)
        .bindPopup(`<b>${s.titre}</b><br>${s.statut}`);
    }
  });
}

initMap();