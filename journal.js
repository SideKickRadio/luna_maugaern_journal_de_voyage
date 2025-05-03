// Structure des données
const journalContent = {
    adventures: [
        {
            id: 1,
            leftPage: {
                date: "Premier croissant",
                location: "Hurlevent",
                title: "Première rencontre",
                content: `Première page`,
                notes: [
                    {
                        text: "Ses yeux dorés... comme une étoile dans la nuit",
                        position: "top-right"
                    }
                ]
            },
            rightPage: {
                type: "illustration",
                image: "./img/luna_maug_symbole.png",
                caption: "Notre tatouage"
            }
        },
        {
            id: 2,
            leftPage: {
                date: "Pleine lune",
                location: "Bosquet du Crépuscule",
                title: "Repos sous la voûte",
                content: `Test deux`,
                notes: []
            },
            rightPage: {
                type: "continuation",
                content: `Suite test`
            }
        },
        // Ajouter plus d'entrées ici
    ]
};

// État de l'application
let currentSection = 'adventures';
let currentPage = 0;

// Éléments DOM
let leftPageContent, rightPageContent, pageIndicator, prevPageBtn, nextPageBtn;

// Initialisation
function initJournal() {
    // Sélecteurs avec vérification
    leftPageContent = document.querySelector('.left-page .page-content');
    rightPageContent = document.querySelector('.right-page .page-content');
    pageIndicator = document.getElementById('page-indicator');
    prevPageBtn = document.getElementById('prev-page');
    nextPageBtn = document.getElementById('next-page');
    
    // Seulement si tous les éléments sont présents
    if (leftPageContent && rightPageContent && pageIndicator && prevPageBtn && nextPageBtn) {
        displayCurrentEntry();
        updatePageIndicator();
        setupEventListeners();
    }
}

// Navigation principale
function initNavigation() {
    const navButtons = document.querySelectorAll('.main-navigation .nav-btn');
    const sections = {
        'journal': document.getElementById('journal-section'),
        'illustrations': document.getElementById('illustrations-section')
    };
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            
            // Mise à jour des boutons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Cacher TOUTES les sections
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
            });
        });
    });
    
    // Initialisation - cache tout et affiche seulement le journal
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    if (sections['journal']) {
        sections['journal'].classList.add('active');
        // Activer aussi le bon bouton
        document.querySelector('.nav-btn[data-section="journal"]').classList.add('active');
    }
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

// Mettre à jour l'indicateur de page et gérer la visibilité des flèches
function updatePageIndicator() {
    const entries = journalContent[currentSection];
    pageIndicator.textContent = `Page ${currentPage + 1} / ${entries.length}`;
    
    // Gérer la visibilité avec classes CSS
    if (currentPage === 0) {
        prevPageBtn.classList.add('hidden');
        prevPageBtn.disabled = true;
    } else {
        prevPageBtn.classList.remove('hidden');
        prevPageBtn.disabled = false;
    }
    
    if (currentPage === entries.length - 1) {
        nextPageBtn.classList.add('hidden');
        nextPageBtn.disabled = true;
    } else {
        nextPageBtn.classList.remove('hidden');
        nextPageBtn.disabled = false;
    }
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
    
    // Gestion des touches clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            turnPage('next');
        } else if (e.key === 'ArrowLeft') {
            turnPage('prev');
        }
    });
}

// Ajoute cette partie au début de ton journal.js
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.main-navigation .nav-btn');
    const sections = {
        'journal': document.getElementById('journal-section'),
        'illustrations': document.getElementById('illustrations-section')
    };
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            
            // Mise à jour des boutons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Affichage des sections
            Object.keys(sections).forEach(key => {
                sections[key].classList.remove('active');
            });
            sections[section].classList.add('active');
        });
    });
    
    // Initialisation (journal visible par défaut)
    sections['journal'].classList.add('active');
});

// Structure des données d'illustrations
const illustrations = [
    {
        id: 1,
        title: "Test 1",
        image: "./img/luna_maug_night_lights.webp",
        description: "Test 1"
    },
    {
        id: 2,
        title: "Test 2",
        image: "./img/luna_maug_symbole.png",
        description: "Test 2"
    },
    // Ajoute d'autres illustrations ici
];

// Initialisation de la galerie
function initGallery() {
    const gallery = document.querySelector('.illustration-gallery');
    const modal = document.getElementById('illustration-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    
    if (!gallery) return;

    // Créer les éléments de la galerie directement
    illustrations.forEach(illustration => {
        const item = document.createElement('div');
        item.className = 'illustration-item';
        item.innerHTML = `
            <img src="${illustration.image}" alt="${illustration.title}">
            <div class="caption">${illustration.title}</div>
        `;

        gallery.appendChild(item);
    });
    
    // Fermer le modal
    const closeModal = () => {
        modal.classList.remove('active');
    };
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Modifie ton DOMContentLoaded pour inclure la galerie
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initJournal();
    initGallery();
});