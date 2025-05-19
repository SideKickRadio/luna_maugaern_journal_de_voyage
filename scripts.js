document.addEventListener('DOMContentLoaded', function() {
    // Configuration de Marked pour une meilleure compatibilité avec le formatage Discord
    // (Option avancée que vous pouvez ajuster selon vos besoins)
    marked.setOptions({
        breaks: true, // Interpréter les retours à la ligne simples comme des <br>
        gfm: true,    // GitHub Flavored Markdown, plus proche de la syntaxe Discord
        smartLists: true
    });

    // Données pour les récits (métadonnées + chemins des fichiers)
    const stories = [
        {
            title: "Titre test",
            subtitle: "Sous-titre test",
            path: "stories/test.md"
        }
        // Vous pourrez ajouter plus de récits ici
    ];

    // Données pour les illustrations
    const illustrations = [
        {
            title: "Promenade nocturne",
            thumbnail: "img/luna_maug_night_lights.webp",
            fullImage: "img/luna_maug_night_lights.webp",
            description: "Deux silhouettes à l'ombre des arbres."
        }
        // Vous pourrez ajouter plus d'illustrations ici
    ];

    // Fonction pour charger un fichier Markdown
    async function loadMarkdownFile(path) {
        try {
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`Impossible de charger le fichier: ${path}`);
            }
            
            const text = await response.text();
            return marked.parse(text); // Convertir Markdown en HTML
        } catch (error) {
            console.error('Erreur lors du chargement du récit:', error);
            return '<p>Impossible de charger ce récit.</p>';
        }
    }

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
    async function loadStories() {
        const storyContainer = document.querySelector('.story-container');
        
        for (const story of stories) {
            // Charger le contenu depuis le fichier Markdown
            const storyContent = await loadMarkdownFile(story.path);
            
            // Créer l'élément HTML pour le récit
            const storyElement = document.createElement('article');
            storyElement.className = 'story';
            
            storyElement.innerHTML = `
                <header class="story-header">
                    <h2 class="story-title">${story.title}</h2>
                    <h3 class="story-subtitle">${story.subtitle}</h3>
                </header>
                <div class="story-content">
                    ${storyContent}
                </div>
            `;
            
            storyContainer.appendChild(storyElement);
        }
    }
    
    // Appeler la fonction pour charger les récits
    loadStories();

    // Charger les illustrations
    const gallery = document.querySelector('.gallery');
    
    illustrations.forEach(illustration => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        galleryItem.innerHTML = `
            <img src="${illustration.thumbnail}" alt="${illustration.title}" data-full="${illustration.fullImage}" data-description="${illustration.description}">
            <div class="gallery-item-overlay">
                <h3 class="gallery-item-title">${illustration.title}</h3>
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