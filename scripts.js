function Book(title, author, numberOfPages, isRead) {
  this.title = title;
  this.author = author;
  this.numberOfPages = numberOfPages;
  this.isRead = isRead;

  this.info = function () {
    return `${this.title} by ${this.author}, ${this.numberOfPages} pages, ${
      this.isRead ? "read" : "not read yet"
    }`;
  };
}

Book.prototype.toggleReadStatus = function () {
  this.isRead = !this.isRead;
};

let library = [];


function saveToLocalStorage() {
  localStorage.setItem('library', JSON.stringify(library));
}

function loadFromLocalStorage() {
  const savedLibrary = localStorage.getItem('library');
  if (savedLibrary) {
      library = JSON.parse(savedLibrary);
  }
}

function displayBooks() {
  let container = document.getElementById("booksContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "booksContainer";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "space-between";
    document.body.appendChild(container);
  } else {
    container.innerHTML = "";
  }

  library.forEach((book, index) => {
    let card = document.createElement("div");
    card.className = "book-card";

    let title = document.createElement("h2");
    title.textContent = book.title;
    card.appendChild(title);

    let author = document.createElement("p");
    author.textContent = `Author: ${book.author}`;
    card.appendChild(author);

    let pages = document.createElement("p");
    pages.textContent = `${book.numberOfPages} pages`;
    card.appendChild(pages);

    let toggleContainer = document.createElement("div");
    toggleContainer.style.display = "flex";
    toggleContainer.style.alignItems = "center";
    toggleContainer.style.gap = "10px";

    let toggleReadBtn = document.createElement("input");
    toggleReadBtn.type = "checkbox";
    toggleReadBtn.className = "toggle-read-status";
    toggleReadBtn.checked = book.isRead;
    toggleReadBtn.dataset.index = index;
    toggleReadBtn.addEventListener("change", toggleReadStatus);
    toggleContainer.appendChild(toggleReadBtn);

    let readStatusLabel = document.createElement("span");
    readStatusLabel.style.fontSize = "0.8rem";
    readStatusLabel.textContent = book.isRead ? "Read" : "Not read";
    toggleContainer.appendChild(readStatusLabel);

    card.appendChild(toggleContainer);

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "remove-book-btn";
    removeBtn.dataset.index = index;
    removeBtn.addEventListener("click", removeBook);

    // Envolver el botón "Remove" en un contenedor para centrarlo
    let removeBtnContainer = document.createElement("div");
    removeBtnContainer.style.width = "100%";
    removeBtnContainer.style.display = "flex";
    removeBtnContainer.style.justifyContent = "center"; // Centra el botón horizontalmente
    removeBtnContainer.style.marginTop = "20px"; // Añade un margen en la parte superior
    removeBtnContainer.appendChild(removeBtn);
    card.appendChild(removeBtnContainer);

    container.appendChild(card);
  });
}

function toggleReadStatus(event) {
  const bookIndex = event.target.dataset.index;
  library[bookIndex].toggleReadStatus();

  // Encuentra el elemento de estado de lectura y actualízalo
  let readStatusLabel = event.target.nextSibling; // Obtiene el elemento de texto que sigue al botón
  readStatusLabel.textContent = library[bookIndex].isRead ? "Read" : "Not read";

  saveToLocalStorage(); // Guarda la biblioteca actualizada en localStorage

}

function removeBook(event) {
  const bookIndex = event.target.dataset.index;
  library.splice(bookIndex, 1);
  let bookCard = event.target.closest("div");
  bookCard.remove();

  saveToLocalStorage(); // Guarda la biblioteca actualizada en localStorage

}

// Cargamos la biblioteca desde localStorage al inicio
loadFromLocalStorage();

// Renderizamos la biblioteca
displayBooks();

document.getElementById("newBookBtn").addEventListener("click", function () {
  document.getElementById("bookFormDialog").showModal();
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  document.getElementById("bookFormDialog").close();
});

document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let numberOfPages = document.getElementById("numberOfPages").value;
    let isRead = document.getElementById("isRead").checked;

    let newBook = new Book(title, author, numberOfPages, isRead);
    library.push(newBook);

    saveToLocalStorage(); // Guarda la biblioteca actualizada en localStorage


    document.getElementById("bookFormDialog").close();
    displayBooks();
  });
