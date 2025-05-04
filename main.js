// Données du journal et de la galerie
const journalContent = {
    entries: [
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
                image: "img/rencontre-hurlevent.jpg",
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
        {
            id: 3,
            leftPage: {
                date: "Dernier croissant",
                location: "Boralus",
                title: "Une nuit étrange",
                content: `Beaucoup de choses se sont déroulées ces derniers jours. Moss s'était mise en tête d'aider Luna concernant ses soucis de logement. Et il se trouve qu'elle avait utilisé une vieille dette pour lui dégoter un plan assez confortable dans un café de Boralus. C'était inespéré.`,
                notes: [
                    {
                        text: "Je n'oublierai jamais cette nuit...",
                        position: "bottom-left"
                    }
                ]
            },
            rightPage: {
                type: "continuation",
                content: `Mais c'est la soirée d'après qui fut des plus bouleversantes. Cette créature... ce rêve partagé. Nous nous sommes retrouvés à l'auberge du Requin, épuisés mais ensemble. Ce lien que nous avons partagé cette nuit-là est devenu indéfectible.`
            }
        }
    ]
};

const galleryItems = [
    {
        id: 1,
        title: "Maugaern, forme d'ours",
        description: "Esquisse de la forme d'ours du druide",
        image: "img/maugaern-ours.jpg",
        fullImage: "img/maugaern-ours-full.jpg",
        tags: ["portrait"]
    },
    {
        id: 2,
        title: "Luna dans la forêt",
        description: "Première illustration de Luna dans son élément naturel",
        image: "img/luna-foret.jpg",
        fullImage: "img/luna-foret-full.jpg",
        tags: ["portrait", "location"]
    },
    {
        id: 3,
        title: "Le Bosquet du Crépuscule",
        description: "Le sanctuaire où Maugaern et Luna trouvent refuge",
        image: "img/bosquet-crepuscule.jpg",
        fullImage: "img/bosquet-crepuscule-full.jpg", 
        tags: ["location"]
    },
    {
        id: 4,
        title: "Le combat dans la fosse",
        description: "Un des combats de Maugaern au club clandestin",
        image: "img/combat-fosse.jpg",
        fullImage: "img/combat-fosse-full.jpg",
        tags: ["scene"]
    },
    {
        id: 5,
        title: "Rencontre à Hurlevent",
        description: "La première rencontre de Luna et Maugaern",
        image: "img/rencontre.jpg",
        fullImage: "img/rencontre-full.jpg",
        tags: ["scene"]
    },
    {
        id: 6,
        title: "Le port de Boralus",
        description: "Vue artistique du port de Boralus",
        image: "img/port-boralus.jpg",
        fullImage: "img/port-boralus-full.jpg",
        tags: ["location"]
    },
    {
        id: 7,
        title: "L'auberge du Requin",
        description: "L'auberge où Luna et Maugaern se sont réfugiés",
        image: "img/auberge-requin.jpg",
        fullImage: "img/auberge-requin-full.jpg",
        tags: ["location"]
    },
    {
        id: 8,
        title: "Luna et ses rêves",
        description: "Illustration conceptuelle des pouvoirs oniriques de Luna",
        image: "img/luna-reves.jpg",
        fullImage: "img/luna-reves-full.jpg",
        tags: ["portrait", "scene"]
    }
];

// État de l'application
let currentJournalPage = 0;
let currentSection = 'journal';
let currentGalleryFilter = 'all';
let currentLightboxIndex = 0;
let filteredGalleryItems = [...galleryItems];

// Éléments DOM - Journal
const leftPageContent = document.querySelector('.left-page .page-content');
const rightPageContent = document.querySelector('.right-page .page-content');
const pageIndicator = document.getElementById('page-indicator');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

// Éléments DOM - Navigation
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

// Éléments DOM - Galerie
const galleryGrid = document.querySelector('.gallery-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeLightboxBtn  = document.querySelector('.close-lightbox');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

// Initialisation
function init() {
    try {
        console.log("Initialisation de l'application...");
        
        // Initialiser le journal
        displayCurrentJournalEntry();
        updatePageIndicator();
        
        // Initialiser la galerie
        renderGalleryItems();
        
        // Configurer les écouteurs d'événements
        setupEventListeners();
        
        console.log("Initialisation terminée avec succès");
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        if (leftPageContent) {
            leftPageContent.innerHTML = `<div class="entry-body error">Une erreur s'est produite: ${error.message}</div>`;
        }
    }
}

// Afficher l'entrée actuelle du journal
function displayCurrentJournalEntry() {
    const entries = journalContent.entries;
    
    // Vérifier que la section contient des entrées
    if (!entries || entries.length === 0) {
        console.log("Aucune entrée dans le journal");
        leftPageContent.innerHTML = `<div class="entry-body">Aucune entrée disponible pour cette section.</div>`;
        rightPageContent.innerHTML = "";
        return;
    }
    
    // Vérifier que la page courante est valide
    if (currentJournalPage < 0 || currentJournalPage >= entries.length) {
        console.error(`Page invalide: ${currentJournalPage} (max: ${entries.length - 1})`);
        currentJournalPage = 0; // Réinitialiser à la première page
    }
    
    console.log(`Affichage de la page ${currentJournalPage + 1}/${entries.length} du journal`);
    
    const entry = entries[currentJournalPage];
    
    // Afficher le contenu de la page gauche
    if (entry.leftPage) {
        const leftHTML = `
            <div class="entry-header">
                <span class="entry-date">${entry.leftPage.date || 'Date inconnue'}</span>
                <span class="entry-location">${entry.leftPage.location || 'Lieu inconnu'}</span>
            </div>
            <h3 class="entry-title">${entry.leftPage.title || 'Sans titre'}</h3>
            <div class="entry-body">${entry.leftPage.content || ''}</div>
            ${entry.leftPage.notes ? entry.leftPage.notes.map(note => `
                <div class="margin-note ${note.position || 'top-right'}">
                    ${note.text || ''}
                </div>
            `).join('') : ''}
        `;
        leftPageContent.innerHTML = leftHTML;
    } else {
        leftPageContent.innerHTML = `<div class="entry-body">Pas de contenu disponible.</div>`;
    }
    
    // Afficher le contenu de la page droite
    if (entry.rightPage) {
        let rightHTML = '';
        
        switch (entry.rightPage.type) {
            case 'illustration':
                rightHTML = `
                    <img src="${entry.rightPage.image}" class="entry-illustration" alt="${entry.rightPage.caption || 'Illustration'}" onerror="this.src='img/placeholder.jpg'; this.alt='Image non disponible';">
                    <p class="image-caption">${entry.rightPage.caption || ''}</p>
                `;
                break;
                
            case 'continuation':
                rightHTML = `
                    <div class="entry-body continuation">${entry.rightPage.content || ''}</div>
                `;
                break;
                
            default:
                rightHTML = `<div class="entry-body">Type de page non reconnu.</div>`;
        }
        
        rightPageContent.innerHTML = rightHTML;
    } else {
        rightPageContent.innerHTML = `<div class="entry-body">Pas de contenu disponible.</div>`;
    }
}

// Mettre à jour l'indicateur de page du journal
function updatePageIndicator() {
    const entries = journalContent.entries;
    if (!entries || entries.length === 0) {
        pageIndicator.textContent = `Page 0 / 0`;
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
    }
    
    pageIndicator.textContent = `Page ${currentJournalPage + 1} / ${entries.length}`;
    
    // Activer/désactiver les boutons selon la position
    prevPageBtn.disabled = currentJournalPage === 0;
    nextPageBtn.disabled = currentJournalPage === entries.length - 1;
}

// Gérer le tournage de page du journal
function turnJournalPage(direction) {
    const entries = journalContent.entries;
    if (!entries || entries.length === 0) return;
    
    // Vérifier si on peut tourner la page
    if (direction === 'next' && currentJournalPage >= entries.length - 1) return;
    if (direction === 'prev' && currentJournalPage <= 0) return;
    
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
            currentJournalPage++;
        } else {
            currentJournalPage--;
        }
        
        // Retirer les classes d'animation
        leftPage.classList.remove('page-turn-right', 'page-turn-left');
        rightPage.classList.remove('page-turn-right', 'page-turn-left');
        
        // Petite pause avant d'afficher le nouveau contenu
        setTimeout(() => {
            displayCurrentJournalEntry();
            updatePageIndicator();
        }, 50);
    }, 400); // Légèrement plus long que la durée de l'animation CSS
}

// Changer de section principale (journal / galerie)
function changeSection(section) {
    if (section === currentSection) return; // Ne rien faire si on clique sur la section active
    
    console.log(`Changement de section: '${currentSection}' -> '${section}'`);
    
    // Mettre à jour la section active
    currentSection = section;
    
    // Mettre à jour les sections actives dans le DOM
    contentSections.forEach(sectionElement => {
        if (sectionElement.id === `${section}-section`) {
            sectionElement.classList.add('active');
        } else {
            sectionElement.classList.remove('active');
        }
    });
    
    // Mettre à jour les liens de navigation
    navLinks.forEach(link => {
        if (link.dataset.section === section) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Filtrer les éléments de la galerie
function filterGallery(tag) {
    if (tag === currentGalleryFilter) return; // Ne rien faire si on clique sur le filtre actif
    
    currentGalleryFilter = tag;
    
    // Mettre à jour les boutons de filtre
    filterButtons.forEach(btn => {
        if (btn.dataset.tag === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filtrer les éléments
    if (tag === 'all') {
        filteredGalleryItems = [...galleryItems];
    } else {
        filteredGalleryItems = galleryItems.filter(item => item.tags.includes(tag));
    }
    
    // Mettre à jour l'affichage
    renderGalleryItems();
}

// Afficher les éléments de la galerie
function renderGalleryItems() {
    if (!galleryGrid) return;
    
    if (filteredGalleryItems.length === 0) {
        galleryGrid.innerHTML = '<p class="no-items">Aucune illustration disponible avec ce filtre.</p>';
        return;
    }
    
    const galleryHTML = filteredGalleryItems.map(item => `
        <div class="gallery-item" data-id="${item.id}">
            <div class="gallery-item-tag">${item.tags[0]}</div>
            <img src="${item.image}" alt="${item.title}" onerror="this.src='img/placeholder.jpg'; this.alt='Image non disponible';">
            <div class="gallery-item-info">
                <h3 class="gallery-item-title">${item.title}</h3>
                <p class="gallery-item-description">${item.description}</p>
            </div>
        </div>
    `).join('');
    
    galleryGrid.innerHTML = galleryHTML;
    
    // Ajouter les écouteurs d'événements pour les éléments de la galerie
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemId = parseInt(item.dataset.id);
            openLightbox(itemId);
        });
    });
}

// Ouvrir la lightbox
function openLightbox(itemId) {
    const itemIndex = filteredGalleryItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    currentLightboxIndex = itemIndex;
    updateLightbox();
    lightbox.style.display = 'flex';
    
    // Empêcher le défilement du body quand la lightbox est ouverte
    document.body.style.overflow = 'hidden';
}

// Mettre à jour la lightbox avec l'image actuelle
function updateLightbox() {
    const item = filteredGalleryItems[currentLightboxIndex];
    
    // Ajout de la classe fade-in pour l'animation
    lightboxImage.classList.remove('fade-in');
    void lightboxImage.offsetWidth; // Force reflow pour réinitialiser l'animation
    lightboxImage.classList.add('fade-in');
    
    lightboxImage.src = item.fullImage || item.image;
    lightboxImage.alt = item.title;
    lightboxCaption.textContent = `${item.title} - ${item.description}`;
    
    // Mettre à jour l'état des boutons de navigation
    lightboxPrev.disabled = currentLightboxIndex === 0;
    lightboxNext.disabled = currentLightboxIndex === filteredGalleryItems.length - 1;
}

// Fermer la lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    // Rétablir le défilement du body
    document.body.style.overflow = '';
}

// Naviguer dans la lightbox
function navigateLightbox(direction) {
    if (direction === 'next' && currentLightboxIndex < filteredGalleryItems.length - 1) {
        currentLightboxIndex++;
        updateLightbox();
    } else if (direction === 'prev' && currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateLightbox();
    }
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Écouteurs pour le journal
    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.addEventListener('click', () => turnJournalPage('prev'));
        nextPageBtn.addEventListener('click', () => turnJournalPage('next'));
    }
    
    // Écouteurs pour la navigation principale
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            changeSection(link.dataset.section);
        });
    });
    
    // Écouteurs pour les filtres de la galerie
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterGallery(btn.dataset.tag);
        });
    });
    
    // Écouteurs pour la lightbox
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    }
    
    // Gestion des touches clavier
    document.addEventListener('keydown', (e) => {
        // Si la lightbox est ouverte
        if (lightbox && lightbox.style.display !== 'none') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            }
        } 
        // Si on est sur la section journal
        else if (currentSection === 'journal') {
            if (e.key === 'ArrowRight') {
                turnJournalPage('next');
            } else if (e.key === 'ArrowLeft') {
                turnJournalPage('prev');
            }
        }
    });
}

// Lancer l'application
document.addEventListener('DOMContentLoaded', init);