export class Book {
  /**
   * Crée une nouvelle instance de Book
   * @param {string} isbn
   * @param {string} title
   * @param {string} author
   * @param {number} year
   * @returns {Book}
   */

  constructor(isbn, title, author, year) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = year;
    this.availability = true;
  }

  displayInfo() {
    const status = this.availability ? "Disponible" : "Emprunté";
    return `${this.title} par ${this.author} (${this.year}) - ${status}`;
  }
}
