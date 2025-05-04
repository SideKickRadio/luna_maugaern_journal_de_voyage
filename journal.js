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
                image: "img/placeholder.jpg",
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
        // Exemple de structure pour les lettres
        {
            id: 1,
            leftPage: {
                date: "Dernier croissant",
                location: "Boralus",
                title: "Lettre à Naerie",
                content: `Ma chère Naerie, les vents ont tourné et mes pas m'ont mené vers l'Est. Je pensais trouver l'oubli loin du Berceau, mais certaines choses nous suivent, n'est-ce pas? J'espère que tu comprends mieux mon départ maintenant.`,
                notes: [
                    {
                        text: "Je n'ai jamais pu lui dire adieu...",
                        position: "bottom-left"
                    }
                ]
            },
            rightPage: {
                type: "continuation",
                content: `La ville m'étouffe parfois, mais j'y ai rencontré des âmes qui valent la peine qu'on se batte pour elles. Tu te moquerais sûrement de me voir ainsi, adouci par le temps. Prends soin de toi, ma sœur.`
            }
        }
    ],
    sketches: [
        // Structure pour les illustrations/croquis
        {
            id: 1,
            leftPage: {
                date: "Mi-saison",
                location: "Bosquet du Crépuscule",
                title: "Étude de l'Arbre-Refuge",
                content: `J'ai essayé de capturer l'essence de notre refuge. Les racines semblent former un berceau naturel, comme si l'arbre lui-même nous invitait à nous reposer.`,
                notes: []
            },
            rightPage: {
                type: "gallery",
                images: [
                    {
                        thumbnail: "images/bosquet-thumb.jpg",
                        fullImage: "images/bosquet-full.jpg",
                        caption: "L'arbre-refuge, vu du sud"
                    },
                    {
                        thumbnail: "images/ours-thumb.jpg",
                        fullImage: "images/ours-full.jpg",
                        caption: "Forme d'ours, première esquisse"
                    }
                ]
            }
        }
    ]
};

// État de l'application
let currentSection = 'adventures';
let currentPage = 0;
let selectedImage = null;

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
    if (!entries || entries.length === 0) {
        leftPageContent.innerHTML = `<div class="entry-body">Aucune entrée disponible pour cette section.</div>`;
        rightPageContent.innerHTML = "";
        return;
    }
    
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
            ${entry.leftPage.notes ? entry.leftPage.notes.map(note => `
                <div class="margin-note ${note.position}">
                    ${note.text}
                </div>
            `).join('') : ''}
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
        } else if (entry.rightPage.type === 'gallery') {
            // Galerie d'images pour la section croquis
            rightHTML = `
                <div class="image-gallery">
                    ${entry.rightPage.images.map((img, index) => `
                        <div class="thumbnail-container">
                            <img src="${img.thumbnail}" 
                                 class="thumbnail" 
                                 alt="${img.caption}"
                                 data-index="${index}"
                                 data-full="${img.fullImage}">
                            <p class="thumbnail-caption">${img.caption}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="fullsize-container" style="display: none;">
                    <img src="" class="fullsize-image" alt="">
                    <span class="close-fullsize">&times;</span>
                </div>
            `;
        }
        
        rightPageContent.innerHTML = rightHTML;
        
        // Ajouter des écouteurs d'événements pour les miniatures si c'est une galerie
        if (entry.rightPage.type === 'gallery') {
            setupGalleryListeners();
        }
    }
}

// Configuration des écouteurs d'événements pour la galerie
function setupGalleryListeners() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const fullsizeContainer = document.querySelector('.fullsize-container');
    const fullsizeImage = document.querySelector('.fullsize-image');
    const closeBtn = document.querySelector('.close-fullsize');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const fullImageSrc = thumb.dataset.full;
            fullsizeImage.src = fullImageSrc;
            fullsizeImage.alt = thumb.alt;
            fullsizeContainer.style.display = 'flex';
            selectedImage = parseInt(thumb.dataset.index);
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            fullsizeContainer.style.display = 'none';
        });
    }
    
    // Fermer l'image en cliquant n'importe où sur le conteneur
    if (fullsizeContainer) {
        fullsizeContainer.addEventListener('click', (e) => {
            if (e.target === fullsizeContainer) {
                fullsizeContainer.style.display = 'none';
            }
        });
    }
}

// Mettre à jour l'indicateur de page
function updatePageIndicator() {
    const entries = journalContent[currentSection];
    if (!entries || entries.length === 0) {
        pageIndicator.textContent = `Page 0 / 0`;
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
    }
    
    pageIndicator.textContent = `Page ${currentPage + 1} / ${entries.length}`;
    
    // Activer/désactiver les boutons selon la position
    prevPageBtn.disabled = currentPage === 0;
    nextPageBtn.disabled = currentPage === entries.length - 1;
}

// Gérer le tournage de page
function turnPage(direction) {
    const entries = journalContent[currentSection];
    if (!entries || entries.length === 0) return;
    
    // Vérifier si on peut tourner la page
    if (direction === 'next' && currentPage >= entries.length - 1) return;
    if (direction === 'prev' && currentPage <= 0) return;
    
    // Préparer les éléments pour l'animation
    const leftPage = document.querySelector('.left-page');
    const rightPage = document.querySelector('.right-page');
    
    // Appliquer les classes d'animation
    if (direction === 'next') {
        leftPage.classList.add('page-turn-right');
        rightPage.classList.add('page-turn-left');
    } else {
        leftPage.classList.add('page-turn-left');
        rightPage.classList.add('page-turn-right');
    }
    
    // Attendre que l'animation soit terminée avant de changer le contenu
    setTimeout(() => {
        // Mettre à jour la page actuelle
        if (direction === 'next') {
            currentPage++;
        } else {
            currentPage--;
        }
        
        // Retirer les classes d'animation
        leftPage.classList.remove('page-turn-right', 'page-turn-left');
        rightPage.classList.remove('page-turn-right', 'page-turn-left');
        
        // Petite pause avant d'afficher le nouveau contenu
        setTimeout(() => {
            displayCurrentEntry();
            updatePageIndicator();
        }, 50);
    }, 400); // Légèrement plus long que la durée de l'animation CSS
}

// Changer de section
function changeSection(section) {
    if (section === currentSection) return; // Ne rien faire si on clique sur la section active
    
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
        } else if (e.key === 'Escape') {
            // Fermer l'image plein écran si ouverte
            const fullsizeContainer = document.querySelector('.fullsize-container');
            if (fullsizeContainer && fullsizeContainer.style.display !== 'none') {
                fullsizeContainer.style.display = 'none';
            }
        }
    });
}

// Lancer l'application
document.addEventListener('DOMContentLoaded', init);