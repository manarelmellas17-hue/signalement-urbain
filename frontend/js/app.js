let tousSignalements = [];

async function chargerSignalements() {
  const res = await fetch(`${API}/signalements`);
  tousSignalements = await res.json();
  afficherSignalements(tousSignalements);
  afficherSurCarte(tousSignalements);
}

function getBadge(statut) {
  const map = {
    en_attente: 'badge-attente',
    en_cours:   'badge-cours',
    resolu:     'badge-resolu',
    rejete:     'badge-rejete'
  };
  return `<span class="badge ${map[statut] || ''}">${statut.replace('_', ' ')}</span>`;
}

function afficherSignalements(liste) {
  const div = document.getElementById('liste-signalements');
  if (!liste.length) {
    div.innerHTML = '<p>Aucun signalement trouvé.</p>';
    return;
  }
  div.innerHTML = liste.filter(s => s.type === 'signalement').map(s => `
    <div class="card" style="border-left: 4px solid #1a73e8">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3>${s.titre || 'Sans titre'}</h3>
        ${getBadge(s.statut)}
      </div>
      <p style="color:#666;margin:.5rem 0">${s.description || ''}</p>
      <small>📍 ${s.localisation?.adresse || 'Localisation inconnue'} 
             — 🗓️ ${new Date(s.date_creation).toLocaleDateString()}
             — 👍 ${s.votes} votes</small>
    </div>
  `).join('');
}

function filtrer() {
  const statut = document.getElementById('filtre-statut').value;
  const filtre = statut
    ? tousSignalements.filter(s => s.statut === statut)
    : tousSignalements;
  afficherSignalements(filtre);
}

updateNav();
chargerSignalements();