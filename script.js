// Daten zur Speicherung in localStorage
let imagePositions = JSON.parse(localStorage.getItem("imagePositions")) || {};

document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.getElementById("image-container");
  const tiers = document.querySelectorAll(".tier");
  const resetButton = document.getElementById("reset-button");

  // Bilddaten laden (Beispiel-Bilder)
  const images = ["img1.png", "img2.png", "img3.png", "img4.png"]; // Pfade zu den Bilddateien

  // Bilder in den Container laden
  images.forEach((imgSrc) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.draggable = true;
    img.id = imgSrc;
    img.addEventListener("dragstart", handleDragStart);
    imageContainer.appendChild(img);
  });

  // Gespeicherte Positionen wiederherstellen
  restorePositions();

  // Event-Listener hinzufügen
  tiers.forEach((tier) => {
    tier.addEventListener("dragover", handleDragOver);
    tier.addEventListener("drop", handleDrop);
  });
  imageContainer.addEventListener("dragover", handleDragOver);
  imageContainer.addEventListener("drop", handleDrop);
  resetButton.addEventListener("click", resetTierlist);

  // Event-Listener
  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }

  function handleDragOver(event) {
    event.preventDefault(); // Erlaubt das Drop-Event
  }

  function handleDrop(event) {
    event.preventDefault();

    // Hole die ID des verschobenen Elements (Bild)
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);

    // Überprüfen, ob das Ziel der Bildcontainer ist
    if (event.target.id === "image-container") {
      const parentContainer = event.target.closest("#image-container"); // Sucht das nächste übergeordnete Element mit der Klasse "tier"
      if (parentContainer) {
        parentContainer.appendChild(draggableElement); // Füge das Bild in das übergeordnete Tier-Element ein
      }
      // Füge das Bild zurück in den Bildcontainer
      event.target.appendChild(draggableElement);
      // Entferne die Position des Bildes aus dem localStorage
      delete imagePositions[id];
      localStorage.setItem("imagePositions", JSON.stringify(imagePositions));
    }
    // Überprüfen, ob das Ziel-Element eine "tier"-Klasse hat
    else if (event.target.classList.contains("tier")) {
      // Wenn das Ziel ein Tierlist-Container ist, füge das Bild dort ein
      event.target.appendChild(draggableElement);
    }
    // Überprüfen, ob das Ziel ein Bild ist
    else if (event.target.tagName.toLowerCase() === "img") {
      // Finde das übergeordnete "tier"-Element des Zielbildes
      const parentTier = event.target.closest(".tier"); // Sucht das nächste übergeordnete Element mit der Klasse "tier"
      if (parentTier) {
        parentTier.appendChild(draggableElement); // Füge das Bild in das übergeordnete Tier-Element ein
      }
    } else {
      console.log("Ungültiges Drop-Ziel");
      return; // Beenden, wenn das Ziel kein gültiges Drop-Ziel ist
    }

    // Position speichern (Tier-Container)
    imagePositions[id] = draggableElement.parentElement.dataset.tier;
    localStorage.setItem("imagePositions", JSON.stringify(imagePositions));
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
    images.forEach((imgSrc) => {
      const img = document.getElementById(imgSrc);
      imageContainer.appendChild(img);
    });
    // Speicher löschen
    imagePositions = {};
    localStorage.removeItem("imagePositions");
  }
});
