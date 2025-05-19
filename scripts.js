document.addEventListener('DOMContentLoaded', function () {
    // Configuration de Marked pour une meilleure compatibilité
    marked.setOptions({
        breaks: true,
        gfm: true,
        smartLists: true
    });

    // Données pour les récits
    const stories = [
        {
            title: "Ces nuits-là",
            subtitle: "Le passé récent de Maugaern",
            path: "stories/ces_nuits_la.md"
        }
        // Vous pourrez ajouter plus de récits ici
    ];

    // Données pour les illustrations
    const illustrations = [
        {
            title: "Promenade nocturne",
            thumbnail: "img/luna_maug_night_lights_thumb.webp",
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
            let htmlContent = marked.parse(text);

            // Détecter et marquer les dialogues de personnages
            htmlContent = processDialogues(htmlContent);

            return htmlContent;
        } catch (error) {
            console.error('Erreur lors du chargement du récit:', error);
            return '<p>Impossible de charger ce récit.</p>';
        }
    }

    // Fonction pour détecter et formater les dialogues
    function processDialogues(htmlContent) {
        // Pattern pour Luna
        htmlContent = htmlContent.replace(
            /<li>(?:\*)?(?:<em>)?(?:—\s*)?(?:\s*)?(Luna\s*[:.]\s*)(?:<\/em>)?(.+?)(?:<\/li>)/gi,
            '<li class="luna">$2</li>'
        );

        // Pattern pour Maugaern
        htmlContent = htmlContent.replace(
            /<li>(?:\*)?(?:<em>)?(?:—\s*)?(?:\s*)?(Mau(?:g|gaern)(?:'|aern)?\s*[:.]\s*)(?:<\/em>)?(.+?)(?:<\/li>)/gi,
            '<li class="maugaern">$2</li>'
        );

        return htmlContent;
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
        const loadingIndicator = document.getElementById('loading-indicator');

        try {
            // Montrer l'indicateur de chargement
            loadingIndicator.style.display = 'block';

            // Vider le conteneur sauf l'indicateur de chargement
            const childElements = Array.from(storyContainer.children);
            childElements.forEach(child => {
                if (child.id !== 'loading-indicator') {
                    storyContainer.removeChild(child);
                }
            });

            // Charger chaque récit
            for (const story of stories) {
                const storyContent = await loadMarkdownFile(story.path);

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
        } catch (error) {
            console.error('Erreur lors du chargement des récits:', error);
            loadingIndicator.textContent = 'Erreur lors du chargement des récits.';
        } finally {
            // Cacher l'indicateur de chargement
            loadingIndicator.style.display = 'none';
        }
    }

    // Charger les illustrations
    function loadIllustrations() {
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
    }

    // Gestion du modal pour les illustrations
    function setupModal() {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const closeModal = document.querySelector('.close-modal');

        // Ouvrir le modal en cliquant sur une image
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', function () {
                modal.style.display = 'block';
                modalImg.src = this.getAttribute('data-full');
                modalCaption.innerHTML = `
                        <h3>${this.alt}</h3>
                        <p>${this.getAttribute('data-description')}</p>
                    `;
            });
        });

        // Fermer le modal
        closeModal.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        // Fermer le modal en cliquant en dehors de l'image
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Initialiser le site
    async function initSite() {
        await loadStories();
        loadIllustrations();
        setupModal();
    }

    // Lancer l'initialisation
    initSite();
});