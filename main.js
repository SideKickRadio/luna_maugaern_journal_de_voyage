document.addEventListener('DOMContentLoaded', function() {
    // Données pour les récits
    const stories = [
        {
            title: "Une soirée... au goût étrange",
            subtitle: "Première partie",
            date: "Premier croissant de Lune",
            location: "Boralus",
            content: `<p>Beaucoup de choses s'étaient déroulées ces derniers jours. À propos de Luna et lui, bien sûr, mais aussi d'autres choses s'étaient accélérées autour d'eux. Moss s'était mise en tête d'aider la demi-kaldoreï concernant ses soucis de logement. Et il se trouve qu'elle avait utilisé une vieille dette pour lui dégoter un plan assez confortable dans un café de Boralus.</p>
                     <p>C'était inespéré. Lui qui s'était fait à l'idée de la porter au bosquet dès qu'elle en aurait eu le besoin. Cette idée lui plaisait mais… il ne devrait plus trop compter dessus.</p>
                     <p>Mais c'est quand il découvrit la bâtisse, un petit commerce, humble quoique sophistiqué dans un sens, qu'il fut rassuré. L'endroit avait l'air d'être à la hauteur de sa soigneuse. Et, surprise, le café ne se situait pas loin d'une des entrées du club. Celle que lui empruntait toujours. C'était une occasion trop précieuse. Alors il fit la paix en lui, et le bosquet restera… le bosquet. Ce café sera… le sien, à présent.</p>`
        },
        {
            title: "Repos, au bosquet",
            subtitle: "Le sanctuaire",
            date: "Pleine Lune",
            location: "Bosquet du Crépuscule",
            content: `<p>Une longue respiration rauque. Le scintillement du puits de lune à proximité. Le bruissement des feuilles au loin, haut vers la cime des grands arbres du bosquet. Et parfois, le passage furtif d'un petit animal sauvage passant par là. Rien de plus.</p>
                     <p>L'atmosphère de ce sanctuaire avait enveloppé les deux dormeurs le temps de deux maigres heures. Un laps de temps qui sembla fuser à une vitesse infinie tant le repos fut profond. Car bien que recouvert d'une épaisse écorce parsemée de végétation, l'ours émettait une aura bien particulière. Une confiance. Une force. Une simplicité. Une chaleur. Une complicité.</p>
                     <p>C'est pour cela que même en l'absence de cuir et de fourrure, le druide ne pouvait s'empêcher d'adopter cette forme pour ses moments de retraite dans le monde sauvage. S'endormir ainsi lui rendait un confort inégalable en plus de le relier toujours un peu plus au Rêve d'Emeraude.</p>`
        }
        // Vous pourrez ajouter plus de récits ici
    ];

    // Données pour les illustrations
    const illustrations = [
        {
            title: "Première rencontre",
            thumbnail: "assets/images/rencontre-thumbnail.jpg",
            fullImage: "assets/images/rencontre-full.jpg",
            description: "La première rencontre entre Luna et Maugaern, dans les ruelles de Hurlevent.",
            date: "Premier croissant de Lune"
        },
        {
            title: "Au Bosquet du Crépuscule",
            thumbnail: "assets/images/bosquet-thumbnail.jpg",
            fullImage: "assets/images/bosquet-full.jpg",
            description: "Luna et Maugaern trouvent refuge et repos dans le Bosquet du Crépuscule.",
            date: "Pleine Lune"
        }
        // Vous pourrez ajouter plus d'illustrations ici
    ];

    // Gestion des onglets
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons et contenus
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');
            
            // Afficher le contenu correspondant
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Charger les récits
    const storyContainer = document.querySelector('.story-container');
    
    stories.forEach(story => {
        const storyElement = document.createElement('article');
        storyElement.className = 'story';
        
        storyElement.innerHTML = `
            <header class="story-header">
                <h2 class="story-title">${story.title}</h2>
                <h3 class="story-subtitle">${story.subtitle}</h3>
                <div class="story-meta">
                    <span class="story-date">${story.date}</span>
                    <span class="story-location">${story.location}</span>
                </div>
            </header>
            <div class="story-content">
                ${story.content}
            </div>
        `;
        
        storyContainer.appendChild(storyElement);
    });

    // Charger les illustrations
    const gallery = document.querySelector('.gallery');
    
    illustrations.forEach(illustration => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <img src="${illustration.thumbnail}" alt="${illustration.title}" data-full="${illustration.fullImage}" data-description="${illustration.description}">
            <div class="gallery-item-overlay">
                <h3 class="gallery-item-title">${illustration.title}</h3>
                <p class="gallery-item-date">${illustration.date}</p>
            </div>
        `;
        
        gallery.appendChild(galleryItem);
    });

    // Gestion du modal pour les illustrations
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    // Ouvrir le modal en cliquant sur une image
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.getAttribute('data-full');
            modalCaption.innerHTML = `
                <h3>${this.alt}</h3>
                <p>${this.getAttribute('data-description')}</p>
            `;
        });
    });

    // Fermer le modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Fermer le modal en cliquant en dehors de l'image
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});