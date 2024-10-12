// Daten zur Speicherung in localStorage
let imagePositions = JSON.parse(localStorage.getItem("imagePositions")) || {};
console.log("Geladene Positionen aus localStorage:", imagePositions); // Debugging: Überprüfe die geladenen Positionen

document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.getElementById("image-container");
  const tiers = document.querySelectorAll(".tier-content");
  const resetButton = document.getElementById("reset-button");

  // Bilddaten laden (Beispiel-Bilder)
  const images = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
    "img7.png",
    "img8.png",
    "img9.png",
    "img10.png",
    "img11.png",
  ]; // Pfade zu den Bilddateien

  // Bilder in den Container laden
  images.forEach((imageName) => {
    const img = document.createElement("img");
    img.src = `images/${imageName}`;
    img.alt = imageName;
    img.draggable = true;
    // Setze die ID ohne Dateiendung (oder mit einem Ersatz für den Punkt)
    img.id = imageName.replace(/\./g, "_");
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
      // Füge das Bild zurück in den Bildcontainer
      event.target.appendChild(draggableElement);
      // Entferne die Position des Bildes aus dem localStorage
      delete imagePositions[id];
      localStorage.setItem("imagePositions", JSON.stringify(imagePositions));
      console.log("Gespeicherte Positionen:", imagePositions); // Debugging: Überprüfe die gespeicherten Positionen
    }
    // Überprüfen, ob auf ein Bild im Bildcontainer gedroppt wurde
    else if (
      event.target.tagName.toLowerCase() === "img" &&
      event.target.closest("#image-container")
    ) {
      // Füge das Bild in den Bildcontainer zurück, wenn auf ein Bild im Container gedroppt wird
      const imageContainer = event.target.closest("#image-container");
      imageContainer.appendChild(draggableElement);
      // Entferne die Position des Bildes aus dem localStorage
      delete imagePositions[id];
      localStorage.setItem("imagePositions", JSON.stringify(imagePositions));
      console.log("Gespeicherte Positionen:", imagePositions); // Debugging: Überprüfe die gespeicherten Positionen
    }
    // Überprüfen, ob das Ziel eine "tier"-Klasse hat
    else if (event.target.classList.contains("tier-content")) {
      // Wenn das Ziel ein Tierlist-Container ist, füge das Bild dort ein
      event.target.appendChild(draggableElement);
      // Position speichern
      imagePositions[id] = event.target.dataset.tier;
      localStorage.setItem("imagePositions", JSON.stringify(imagePositions));
      console.log("Gespeicherte Positionen:", imagePositions); // Debugging: Überprüfe die gespeicherten Positionen
    }
    // Überprüfen, ob auf ein Bild in der Tierlist gedroppt wurde
    else if (event.target.tagName.toLowerCase() === "img") {
      // Finde das übergeordnete "tier"-Element des Zielbildes
      const parentTier = event.target.closest(".tier-content"); // Sucht das nächste übergeordnete Element mit der Klasse "tier"
      if (parentTier) {
        parentTier.appendChild(draggableElement); // Füge das Bild in das übergeordnete Tier-Element ein
        // Position speichern
        imagePositions[id] = parentTier.dataset.tier;
        localStorage.setItem("imagePositions", JSON.stringify(imagePositions));
        console.log("Gespeicherte Positionen:", imagePositions); // Debugging: Überprüfe die gespeicherten Positionen
      }
    } else {
      console.log("Ungültiges Drop-Ziel");
      return; // Beenden, wenn das Ziel kein gültiges Drop-Ziel ist
    }
  }

  function restorePositions() {
    for (const [id, tier] of Object.entries(imagePositions)) {
      const img = document.getElementById(id.replace(/\./g, "_")); // IDs ohne Punkt verwenden
      const tierElement = document.querySelector(
        `.tier-content[data-tier="${tier}"]`
      );
      if (tierElement && img) {
        tierElement.appendChild(img);
      }
    }
  }

  function resetTierlist() {
    // Alle Bilder zurück in den Container
    images.forEach((imgSrc) => {
      const img = document.getElementById(imgSrc.replace(/\./g, "_"));
      imageContainer.appendChild(img);
    });
    // Speicher löschen
    imagePositions = {};
    localStorage.removeItem("imagePositions");
  }
});
