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
            path: "stories/ces_nuits_la.md",
            tag: "oneshot",
            excerpt: "Ces nuits-là... Ces nuits-là, elles se ressemblent toutes. Il y a toujours un certain tumulte à l'intérieur, peu importe les enjeux du combat qui arrive. Les spectateurs se mélangent aux parieurs"
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

    // Variables globales
    let loadedStories = [];
    let currentStoryIndex = 0;
    let filteredStories = [];
    let currentFilter = 'all';

    // Éléments DOM
    const storyOverview = document.getElementById('story-overview');
    const storyReader = document.getElementById('story-reader');
    const currentStoryDiv = document.getElementById('current-story');
    const loadingIndicator = document.getElementById('loading-indicator');
    const backBtn = document.getElementById('back-to-overview');
    const prevBtn = document.getElementById('prev-story');
    const nextBtn = document.getElementById('next-story');
    const storyCounter = document.getElementById('story-counter');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Fonction pour charger un fichier Markdown
    async function loadMarkdownFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Impossible de charger le fichier: ${path}`);
            }
            const text = await response.text();
            let htmlContent = marked.parse(text);
            htmlContent = processDialogues(htmlContent);
            return htmlContent;
        } catch (error) {
            console.error('Erreur lors du chargement du récit:', error);
            return '<p>Impossible de charger ce récit.</p>';
        }
    }

    // Fonction pour détecter et formater les dialogues
    function processDialogues(htmlContent) {
        htmlContent = htmlContent.replace(
            /<li>(?:\*)?(?:<em>)?(?:—\s*)?(?:\s*)?(Luna\s*[:.]\s*)(?:<\/em>)?(.+?)(?:<\/li>)/gi, 
            '<li class="luna"><span class="speaker-name">$1</span>$2</li>'
        );
        
        htmlContent = htmlContent.replace(
            /<li>(?:\*)?(?:<em>)?(?:—\s*)?(?:\s*)?(Mau(?:g|gaern)(?:'|aern)?\s*[:.]\s*)(?:<\/em>)?(.+?)(?:<\/li>)/gi, 
            '<li class="maugaern"><span class="speaker-name">$1</span>$2</li>'
        );
        
        return htmlContent;
    }

    // Charger tous les récits
    async function loadAllStories() {
        try {
            loadingIndicator.style.display = 'block';
            
            for (let i = 0; i < stories.length; i++) {
                const story = stories[i];
                const content = await loadMarkdownFile(story.path);
                
                loadedStories.push({
                    ...story,
                    content: content,
                    index: i
                });
            }
            
            filteredStories = [...loadedStories];
            displayStoryOverview();
            
        } catch (error) {
            console.error('Erreur lors du chargement des récits:', error);
            loadingIndicator.textContent = 'Erreur lors du chargement des récits.';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Afficher la vue d'ensemble
    function displayStoryOverview() {
        const container = storyOverview;
        
        // Vider le container sauf l'indicateur de chargement
        Array.from(container.children).forEach(child => {
            if (child.id !== 'loading-indicator') {
                container.removeChild(child);
            }
        });

        filteredStories.forEach((story, index) => {
            const previewElement = document.createElement('div');
            previewElement.className = `story-preview ${story.tag}`;
            previewElement.dataset.index = story.index;
            
            previewElement.innerHTML = `
                <div class="preview-header">
                    <div>
                        <h3 class="story-title">${story.title}</h3>
                        <h4 class="story-subtitle">${story.subtitle}</h4>
                    </div>
                    <span class="story-tag ${story.tag}">${story.tag === 'journal' ? 'Journal' : 'Récit'}</span>
                </div>
                <div class="preview-excerpt">${story.excerpt}</div>
            `;
            
            previewElement.addEventListener('click', () => openStoryReader(story.index));
            container.appendChild(previewElement);
        });
    }

    // Ouvrir le lecteur immersif
    function openStoryReader(storyIndex) {
        currentStoryIndex = storyIndex;
        displayCurrentStory();
        storyReader.style.display = 'block';
        storyReader.classList.add('entering');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            storyReader.classList.remove('entering');
        }, 300);
    }

    // Fermer le lecteur immersif
    function closeStoryReader() {
        storyReader.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Afficher le récit actuel dans le lecteur
    function displayCurrentStory() {
        const story = loadedStories[currentStoryIndex];
        
        currentStoryDiv.innerHTML = `
            <header class="story-header">
                <h2 class="story-title">${story.title}</h2>
                <h3 class="story-subtitle">${story.subtitle}</h3>
            </header>
            <div class="story-content">
                ${story.content}
            </div>
        `;

        updateNavigationButtons();
    }

    // Mettre à jour les boutons de navigation
    function updateNavigationButtons() {
        const currentInFiltered = filteredStories.findIndex(s => s.index === currentStoryIndex);
        const totalFiltered = filteredStories.length;
        
        prevBtn.disabled = currentInFiltered <= 0;
        nextBtn.disabled = currentInFiltered >= totalFiltered - 1;
        
        storyCounter.textContent = `${currentInFiltered + 1} / ${totalFiltered}`;
    }

    // Navigation entre récits
    function navigateStory(direction) {
        const currentInFiltered = filteredStories.findIndex(s => s.index === currentStoryIndex);
        let newIndex;
        
        if (direction === 'prev' && currentInFiltered > 0) {
            newIndex = filteredStories[currentInFiltered - 1].index;
        } else if (direction === 'next' && currentInFiltered < filteredStories.length - 1) {
            newIndex = filteredStories[currentInFiltered + 1].index;
        } else {
            return;
        }
        
        currentStoryIndex = newIndex;
        displayCurrentStory();
    }

    // Filtrage des récits
    function filterStories(filter) {
        currentFilter = filter;
        
        if (filter === 'all') {
            filteredStories = [...loadedStories];
        } else {
            filteredStories = loadedStories.filter(story => story.tag === filter);
        }
        
        displayStoryOverview();
        
        // Mettre à jour les boutons de filtre
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Gestion des onglets principaux
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Charger les illustrations (fonction simplifiée de votre code existant)
    function loadIllustrations() {
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
    }

    // Configuration du modal pour les illustrations (votre code existant)
    function setupModal() {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const closeModal = document.querySelector('.close-modal');

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

        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Event listeners
    backBtn.addEventListener('click', closeStoryReader);
    prevBtn.addEventListener('click', () => navigateStory('prev'));
    nextBtn.addEventListener('click', () => navigateStory('next'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterStories(btn.dataset.filter);
        });
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (storyReader.style.display === 'block') {
            if (e.key === 'Escape') {
                closeStoryReader();
            } else if (e.key === 'ArrowLeft') {
                navigateStory('prev');
            } else if (e.key === 'ArrowRight') {
                navigateStory('next');
            }
        }
    });

    // Initialisation
    async function initSite() {
        await loadAllStories();
        loadIllustrations();
        setupModal();
    }

    initSite();
});