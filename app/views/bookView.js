import readline from "node:readline";

import { BookRepository } from "../repositories/bookRepository.js";
import { Book } from "../models/book.js";

export class BookView {
  constructor() {
    this.bookRepository = new BookRepository();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  displayMenu() {
    this.rl.question(
      `
      1 - Ajouter un livre
      2 - Voir tous les livres
      3 - Rechercher un livre
      4 - Emprunter un livre
      5 - Retourner un livre
      6 - Quitter
      Choisissez une option: `,
      (answer) => {
        this.execute(answer);
      }
    );
  }

  addBook() {
    this.rl.question("ISBN: ", (isbn) => {
      this.rl.question("Titre: ", (title) => {
        this.rl.question("Auteur: ", (author) => {
          this.rl.question("Année: ", (year) => {
            if (isbn.length < 10) {
              console.error("❌ ISBN invalide (minimum 10 caractères)");
              return this.addBook();
            }

            if (!title || !author) {
              console.error("❌ Titre et auteur obligatoires");
              return this.addBook();
            }

            if (!parseInt(year)) {
              console.error("❌ Année doit être un nombre");
              return this.addBook();
            }

            const yearNum = parseInt(year);
            if (yearNum < 1000 || yearNum > 2025) {
              console.error("❌ Année invalide");
              return this.addBook();
            }

            try {
              const book = new Book(isbn, title, author, year);
              this.bookRepository.addBook(book);
              console.log("✓ Livre ajouté avec succès!");
            } catch (error) {
              console.error("❌ Erreur lors de l'ajout du livre :", error.message);
              this.rl.question("Voulez-vous réessayer ? (o/n): ", (retry) => {
                if (retry.toLowerCase() === "o" || retry.toLowerCase() === "oui") {
                  return this.addBook();
                } else {
                  return this.displayMenu();
                }
              });
            } finally {
              this.rl.question("Revenir au menu principal ? (o/n): ", (answer) => {
                if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
                  this.displayMenu();
                } else {
                  console.log("Au revoir!");
                  this.rl.close();
                }
              });
            }
          });
        });
      });
    });
  }

  async showAllBooks() {
    try {
      const books = await this.bookRepository.getBooks();

      this.rl.write("--- Tous les livres ---\n");
      if (books.length === 0) this.rl.write("Aucun livre dans la bibliothèque.");
      books.forEach((book) => console.log(`${book.displayInfo()}`));
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des livres :", error.message);
    } finally {
      this.rl.question("Revenir au menu principal ? (o/n): ", (answer) => {
        if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
          this.displayMenu();
        } else {
          console.log("Au revoir!");
          this.rl.close();
        }
      });
    }
  }

  async searchBook() {
    this.rl.question("Entrez l'ISBN du livre à rechercher: ", async (searchedIsbn) => {
      try {
        const book = await this.bookRepository.searchBook(searchedIsbn);
        if (book) {
          console.log("Livre trouvé:");
          console.log(book.displayInfo());
        } else {
          console.log("Aucun livre trouvé avec cet ISBN.");
          return this.rl.question("Recommencer ? (o/n): ", (answer) => {
            if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
              this.searchBook();
            } else {
              console.log("Au revoir!");
              this.rl.close();
            }
          });
        }
      } catch (error) {
        console.error("❌ Erreur lors de la recherche du livre :", error.message);
      } finally {
        this.rl.question("Revenir au menu principal ? (o/n): ", (answer) => {
          if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
            this.displayMenu();
          } else {
            console.log("Au revoir!");
            this.rl.close();
          }
        });
      }
    });
  }

  async borrowBook() {
    this.rl.question("Entrez l'ISBN du livre à emprunter: ", async (isbn) => {
      try {
        const success = await this.bookRepository.borrowBook(isbn);
        if (success) {
          console.log("✓ Livre emprunté avec succès!");
        } else {
          console.log(
            "❌ Impossible d'emprunter ce livre (peut-être déjà emprunté ou inexistant)."
          );
          return this.rl.question("Recommencer ? (o/n): ", (answer) => {
            if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
              this.borrowBook();
            } else {
              console.log("Au revoir!");
              this.rl.close();
            }
          });
        }
      } catch (error) {
        console.error("❌ Erreur lors de l'emprunt du livre :", error.message);
      } finally {
        this.rl.question("Revenir au menu principal ? (o/n): ", (answer) => {
          if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
            this.displayMenu();
          } else {
            console.log("Au revoir!");
            this.rl.close();
          }
        });
      }
    });
  }

  async returnBook() {
    this.rl.question("Entrez l'ISBN du livre à retourner: ", async (isbn) => {
      try {
        const success = await this.bookRepository.returnBook(isbn);
        if (success) {
          console.log("✓ Livre retourné avec succès!");
        } else {
          console.log(
            "❌ Impossible de retourner ce livre (peut-être pas emprunté ou inexistant)."
          );
          return this.rl.question("Recommencer ? (o/n): ", (answer) => {
            if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
              this.returnBook();
            } else {
              console.log("Au revoir!");
              s;
              this.rl.close();
            }
          });
        }
      } catch (error) {
        console.error("❌ Erreur lors du retour du livre :", error.message);
      } finally {
        this.rl.question("Revenir au menu principal ? (o/n): ", (answer) => {
          if (answer.toLowerCase() === "o" || answer.toLowerCase() === "oui") {
            this.displayMenu();
          } else {
            console.log("Au revoir!");
            this.rl.close();
          }
        });
      }
    });
  }

  async execute(answer) {
    switch (answer) {
      case "1":
        this.addBook();
        break;
      case "2":
        await this.showAllBooks();
        break;
      case "3":
        await this.searchBook();
        break;
      case "4":
        await this.borrowBook();
        break;
      case "5":
        await this.returnBook();
        break;
      case "6":
        console.log("Au revoir!");
        this.rl.close();
        break;
      default:
        console.log("Option non reconnue");
        this.displayMenu();
    }
  }
}
