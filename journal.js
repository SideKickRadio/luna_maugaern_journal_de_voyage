// Structure des données
const journalContent = {
    adventures: [
        {
            id: 1,
            leftPage: {
                date: "Premier croissant",
                location: "Hurlevent",
                title: "Première rencontre",
                content: `J'ai croisé aujourd'hui, au détour d'une ruelle non loin de l'église de Hurlevent, une silhouette aux habits typiques de ma contrée. Le cuir et les fourrures qu'elle arborait m'ont rappelé le Berceau-de-l'Hiver... Mon attention fut aussitôt piquée et mon jugement brouillé.`,
                notes: [
                    {
                        text: "Ses yeux dorés... comme une étoile dans la nuit",
                        position: "top-right"
                    }
                ]
            },
            rightPage: {
                type: "illustration",
                image: "images/rencontre-hurlevent.jpg",
                caption: "Les rues de Hurlevent où nos chemins se sont croisés"
            }
        },
        {
            id: 2,
            leftPage: {
                date: "Pleine lune",
                location: "Bosquet du Crépuscule",
                title: "Repos sous la voûte",
                content: `Une longue respiration rauque. Le scintillement du puits de lune à proximité. Le bruissement des feuilles au loin, haut vers la cime des grands arbres du bosquet. Et parfois, le passage furtif d'un petit animal sauvage passant par là. Rien de plus. L'atmosphère de ce sanctuaire nous a enveloppés le temps de deux maigres heures.`,
                notes: []
            },
            rightPage: {
                type: "continuation",
                content: `Un laps de temps qui sembla fuser à une vitesse infinie tant le repos fut profond. Car bien que recouvert d'une épaisse écorce parsemée de végétation, l'ours émettait une aura bien particulière. Une confiance. Une force. Une simplicité. Une chaleur. Une complicité.`
            }
        },
        // Ajouter plus d'entrées ici
    ],
    letters: [
        // Structure pour les lettres
    ],
    sketches: [
        // Structure pour les croquis
    ]
};

// État de l'application
let currentSection = 'adventures';
let currentPage = 0;

// Éléments DOM
const leftPageContent = document.querySelector('.left-page .page-content');
const rightPageContent = document.querySelector('.right-page .page-content');
const pageIndicator = document.getElementById('page-indicator');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const navButtons = document.querySelectorAll('.nav-btn');

// Initialisation
function init() {
    displayCurrentEntry();
    updatePageIndicator();
    setupEventListeners();
}

// Afficher l'entrée actuelle
function displayCurrentEntry() {
    const entries = journalContent[currentSection];
    if (!entries || entries.length === 0) return;
    
    const entry = entries[currentPage];
    
    // Page gauche
    if (entry.leftPage) {
        const leftHTML = `
            <div class="entry-header">
                <span class="entry-date">${entry.leftPage.date}</span>
                <span class="entry-location">${entry.leftPage.location}</span>
            </div>
            <h3 class="entry-title">${entry.leftPage.title}</h3>
            <div class="entry-body">${entry.leftPage.content}</div>
            ${entry.leftPage.notes.map(note => `
                <div class="margin-note ${note.position}">
                    ${note.text}
                </div>
            `).join('')}
        `;
        leftPageContent.innerHTML = leftHTML;
    }
    
    // Page droite
    if (entry.rightPage) {
        let rightHTML = '';
        
        if (entry.rightPage.type === 'illustration') {
            rightHTML = `
                <img src="${entry.rightPage.image}" class="entry-illustration" alt="${entry.rightPage.caption}">
                <p class="image-caption">${entry.rightPage.caption}</p>
            `;
        } else if (entry.rightPage.type === 'continuation') {
            rightHTML = `
                <div class="entry-body continuation">${entry.rightPage.content}</div>
            `;
        }
        
        rightPageContent.innerHTML = rightHTML;
    }
}

// Mettre à jour l'indicateur de page
function updatePageIndicator() {
    const entries = journalContent[currentSection];
    pageIndicator.textContent = `Page ${currentPage + 1} / ${entries.length}`;
    
    // Activer/désactiver les boutons selon la position
    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage === entries.length - 1;
}

// Gérer le tournage de page - version simplifiée
function turnPage(direction) {
    const entries = journalContent[currentSection];
    
    // Vérifier si on peut tourner la page
    if (direction === 'next' && currentPage >= entries.length - 1) return;
    if (direction === 'prev' && currentPage <= 0) return;
    
    // Récupérer les conteneurs de contenu
    const leftContent = document.querySelector('.left-page .page-content');
    const rightContent = document.querySelector('.right-page .page-content');
    
    // 1. Faire disparaître le contenu actuel
    leftContent.classList.add('fade-out');
    rightContent.classList.add('fade-out');
    
    // 2. Après que le contenu ait disparu, changer la page et afficher le nouveau contenu
    setTimeout(() => {
        // Mettre à jour l'index de page
        if (direction === 'next') {
            currentPage++;
        } else {
            currentPage--;
        }
        
        // Mettre à jour le contenu
        displayCurrentEntry();
        updatePageIndicator();
        
        // Retirer la classe de disparition
        leftContent.classList.remove('fade-out');
        rightContent.classList.remove('fade-out');
        
        // Ajouter la classe d'apparition
        leftContent.classList.add('fade-in');
        rightContent.classList.add('fade-in');
        
        // Nettoyer les classes d'animation après la fin
        setTimeout(() => {
            leftContent.classList.remove('fade-in');
            rightContent.classList.remove('fade-in');
        }, 300);
    }, 300);
}

// Changer de section
function changeSection(section) {
    currentSection = section;
    currentPage = 0;
    displayCurrentEntry();
    updatePageIndicator();
    
    // Mettre à jour les boutons de navigation
    navButtons.forEach(btn => {
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    prevPageBtn.addEventListener('click', () => turnPage('prev'));
    nextPageBtn.addEventListener('click', () => turnPage('next'));
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            changeSection(btn.dataset.section);
        });
    });
    
    // Gestion des touches clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            turnPage('next');
        } else if (e.key === 'ArrowLeft') {
            turnPage('prev');
        }
    });
}

// Lancer l'application
document.addEventListener('DOMContentLoaded', init);