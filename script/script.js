//on crée une option pour l'affichage de la date et on précise comment on veut l'afficher
let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

let bookList = new Array();
let authorsList = new Array();
let categoriesList = new Array();

let listAuthors = document.getElementById("listAuthors");
let listCategories = document.getElementById("listCategories");
let listBooks = document.getElementById("booksList");

//Quand on change sur la liste on appelle la fonction chargeByAuthor/chargeByCategory
listAuthors.addEventListener("change", chargeByAuthor);
listCategories.addEventListener("change", chargeByCategory);

// On créé l'écouteur d'evenements sur le load de notre page
window.addEventListener("DOMContentLoaded", jsonOnLoad);

// Fonction qui appele le chargement  du json
function jsonOnLoad() {
  fetch("data/books.json")
    .then((response) => {
      return response.json(); //On covertit la reponse en json
    })
    .then((data) => {
      console.log(data);
      createBooks(data);
    });
}

// Fonction qui affiche les livres.... mais aussi qui crééera les listes déroulantes
function createBooks(_books) {
  // On boucle sur l'ensemble des livres : je m'en servirai pour afficher mes livres plus tard
  for (let book of _books) {
    //On ajoute tous les livres dans la liste
    bookList.push(book);
    //On crée une deuxième boucle car on peut avoir +sieurs auteurs pour un seul livre=> ça nous renvoie donc un tableau
    for (let x = 0; x < book.authors.length; x++) {
      //On  crée une variable qui nous renverra tous les auteurs (sans doublons)
      let author = book.authors[x];
      // Je vais vérifier que l'auteur n'est pas dans ma liste des auteurs grâce à la fonction native indexOf()
      if (authorsList.indexOf(author) == -1) {
        //S'il n'y est pas je l'ajoute dans ma liste d'auteurs
        authorsList.push(author);
      }
      // // Je ferais la même chose pour la liste des catégories
      //On crée une boucle pour avoir la liste des catégories
      for (y = 0; y < book.categories.length; y++) {
        let categorie = book.categories[y];
        if (categoriesList.indexOf(categorie) == -1) {
          categoriesList.push(categorie);
        }
      }
    }
  }
  //pour que la liste soit dans l'ordre alphabéthique
  authorsList.sort();
  categoriesList.sort()
  //on crée une boucle pour afficher la liste de nos auteurs
  for (let i = 0; i < authorsList.length; i++) {
    //On crée un balise html (option pour une liste déroulante) pour pouvoir séléctionner un élément dans notre liste
    let option = document.createElement("option");
    option.value = authorsList[i];
    //l'élément séléctionné s'affichera donc
    option.innerText = authorsList[i];
    //Notre nouvelle balise sera un enfant de notre balise select déjà présent dans le html
    listAuthors.appendChild(option);
  }

  //On crée une boucle pour afficher la liste de nos catégories
  for (let j = 0; j < categoriesList.length; j++) {
    let option = document.createElement("option");
    option.value = categoriesList[j];
    option.innerText = categoriesList[j];
    listCategories.appendChild(option);
  }

  //On appelle notre fonction pour pouvoir afficher notre liste de livre
  showBooks(bookList);
}

//On crée une nouvelle fonction pour afficher nos livres
function showBooks(_books) {
  //On initialise notre liste à vide ("") pour éviter que ça se rajoute dès qu'on relance la page
  listBooks.innerHTML = "";

  //On crée une boucle pour pouvoir traiter chaque livre l'un après l'autre
  for (y = 0; y < _books.length; y++) {
    //on crée une nouvelle variable pour chaque livre
    let book = document.createElement("div");
    //On lui donne une class="card" et vu qu'on a déjà ajouté bootstrap dans notre html ça va le faire automatiquement
    book.setAttribute("class", "card");

    //On vérifie si notre image est présente dans notre json
    if (_books[y].thumbnailUrl == undefined || _books[y].thumbnailUrl == null) {
      //si elle n'y est pas on met une image par défaut
      _books[y].thumbnailUrl =
        "https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png";
    }

    let titre;
    //on vérifie si la longueur de notre titre dépasse 20 caractères
    if (_books[y].title.length > 20) {
      //si c'est le cas on affiche les 20 premiers caractères avec (...) à la fin
      titre = _books[y].title.substring(0, 20) + "(...)";
    } else {
      //sinon on affiche tout le titre
      titre = _books[y].title;
    }

    let description;
    let shortDescription;

    if (
      //on vérifie s'il y a une courte description
      _books[y].shortDescription == undefined ||
      _books[y].shortDescription == null
    ) {
      if (
        //on vérifie aussi s'il y a une longue description
        _books[y].longDescription == undefined ||
        _books[y].longDescription == null
      ) {
        //s'il n'y a pas on affiche par défaut "Pas de description"
        shortDescription = "Pas de description";
      } else {
        //sinon on affiche les 100 premiers caractères de longue description
        shortDescription = _books[y].longDescription.substring(0, 100);
      }
    } else {
      //sinon on affiche la courte description
      shortDescription = _books[y].shortDescription;
    }
    if (
      //on verifie s'il y a une longue description
      _books[y].longDescription == undefined ||
      _books[y].longDescription == null
    ) {
      //si oui elle s'affichera
      description = _books[y].longDescription;
    } else {
      //sinon on affichera par défaut "Pas de description"
      description = "Pas de description";
    }
    //on vérifie si la courte description dépasse 100 caractères
    if (_books[y].shortDescription > 100) {
      //si c'est le cas on affiche les 100 premiers avec (...) à la fin
      shortDescription = shortDescription.substring(0, 100) + "(...)";
    } else {
      //sinon on affiche tout
      shortDescription = shortDescription;
    }

    let datePubli;
    //On fait une gestion des erreur
    try {
      //On essaie de voir si la date existe dans notre base
      //la fonction native toLocaleDateString() permet d'envoyer une chaine de caractère en format date locale; on lui donne comme paramètre la langue française et les options qu'on a crée au tout début du fichier
      datePubli = new Date(_books[y].publishedDate.dt_txt).toLocaleDateString(
        "fr-FR",
        options
      );
    } catch (error) {
      //S'il n'y a pas de date ça affichera par défaut
      datePubli = "Pas de date de pblication";
    }

    //On crée une variable pour ajouter l'isbn de chaque livre
    let isbn;
    isbn = _books[y].isbn


    //on ajoute tous nos éléments dans le html
    book.innerHTML =
      "<img src= '" +
      _books[y].thumbnailUrl +
      "'/>" +
      //le <span> permet d'afficher une infobulle dès que le pointeur de la souris est sur le titre
      "<h2 class= 'booktitle'><span class = 'infobulle' title ='" +
      _books[y].title +
      "'>" +
      titre +
      "</span></h2>" +
      "<p> Date de publication : " +
      datePubli +
      "</p>" +
      //le <span> permet d'afficher une infobulle dès que le pointeur de la souris est sur le shortDescription
      "<p> <span class = 'infobulle' title ='" +
      description +
      "'>" +
      shortDescription +
      "</span></p>" +
      "<p> Isbn : " + isbn + "</p>";

    //On ajoute la balise crée ("div") dans notre liste de livre ("bookList")
    listBooks.appendChild(book);
  }
}
// Fonction appelée lors du changement d'auteur dans la liste déroulante
function chargeByAuthor() {
  //On crée une variable qui nous renverra le nom de l'auteur séléctionné grâce au "selectedIndex" (chaque auteur devient une option de la liste déroulante)
  let strAuthors = listAuthors.options[listAuthors.selectedIndex].text;
  console.log(strAuthors);

  //On Crée une nouvelle liste pour les livres filtrés par auteur
  let bookByAutors = new Array();

  //Si la séléction est vide on affiche la liste des livres
  if (strAuthors == "") {
    return showBooks(bookList);
  } else {
    //On crée une boucle sur les livres pour filtrer par auteur
    for (let x = 0; x < bookList.length; x++) {
      let book = bookList[x];

      // Ajoute le livre à la liste si l'auteur correspond
      if (book.authors.indexOf(strAuthors) != -1) {
        bookByAutors.push(book);
      }
    }
  }
  //Trie la liste des livres filtrés et les affiche
  bookByAutors.sort();
  showBooks(bookByAutors);
}

// Fonction appelée lors du changement de catégorie dans la liste déroulante
function chargeByCategory() {
  //On crée une variable qui nous renverra la catégorie séléctionné grâce au "selectedIndex" (chaque catégorie devient une option de la liste déroulante)
  let strCategories = listCategories.options[listCategories.selectedIndex].text;
  console.log(strCategories);
  //On crée une nouvelle liste pour les livres filtrés par catégories
  let bookCategorie = new Array();
  //si la séléction est vide on affiche la liste des livres
  if (strCategories == "") {
    return showBooks(bookList);
  } else {
    //On crée une boucle pour filtrer les livres par catégories
    for (y = 0; y < bookList.length; y++) {
      let categorie = bookList[y];

      //Ajoute le livre si la catégorie correspond
      if (categorie.categories.indexOf(strCategories) != -1) {
        bookCategorie.push(categorie);
      }
    }
  }
  //Trie de la liste par ordre alphabétique et les affiche
  bookCategorie.sort();
  showBooks(bookCategorie);
}