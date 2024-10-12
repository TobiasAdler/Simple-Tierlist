// Daten zur Speicherung in localStorage
let imagePositions = JSON.parse(localStorage.getItem('imagePositions')) || {};

document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('image-container');
    const tiers = document.querySelectorAll('.tier');
    const resetButton = document.getElementById('reset-button');

    // Bilddaten laden (Beispiel-Bilder)
    const images = ['img1.png', 'img2.png', 'img3.png', 'img4.png']; // Pfade zu den Bilddateien

    // Bilder in den Container laden
    images.forEach((imgSrc) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.draggable = true;
        img.id = imgSrc;
        img.addEventListener('dragstart', handleDragStart);
        imageContainer.appendChild(img);
    });

    // Gespeicherte Positionen wiederherstellen
    restorePositions();

    tiers.forEach(tier => {
        tier.addEventListener('dragover', handleDragOver);
        tier.addEventListener('drop', handleDrop);
    });

    resetButton.addEventListener('click', resetTierlist);

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault(); // Erlaubt das Drop-Event
    }

    function handleDrop(event) {
        event.preventDefault();
        const id = event.dataTransfer.getData('text');
        const draggableElement = document.getElementById(id);
        event.target.appendChild(draggableElement);
        // Position speichern
        imagePositions[id] = event.target.dataset.tier;
        localStorage.setItem('imagePositions', JSON.stringify(imagePositions));
    }

    function restorePositions() {
        for (const [id, tier] of Object.entries(imagePositions)) {
            const img = document.getElementById(id);
            const tierElement = document.querySelector(`.tier[data-tier="${tier}"]`);
            if (tierElement && img) {
                tierElement.appendChild(img);
            }
        }
    }

    function resetTierlist() {
        // Alle Bilder zurück in den Container
        images.forEach(imgSrc => {
            const img = document.getElementById(imgSrc);
            imageContainer.appendChild(img);
        });
        // Speicher löschen
        imagePositions = {};
        localStorage.removeItem('imagePositions');
    }
});
