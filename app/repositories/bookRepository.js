import pg from "pg";
import { Book } from "../models/book.js";

const { Pool } = pg;

export class BookRepository {
  constructor() {
    this.connection = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  async initialize() {
    const sql = `
      CREATE TABLE IF NOT EXISTS books (
        isbn TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER,
        availability INTEGER DEFAULT 1
      );
    `;

    try {
      await this.connection.query(sql);
    } catch (error) {
      console.error(">> ‼️ Erreur lors de l'initialisation de la base de données :", error);
    }

    console.log(">> ✅ Base de données initialisée avec succès.");
  }

  addBook(book) {
    const sql = `
      INSERT INTO books (isbn, title, author, year, availability)
      VALUES ($1, $2, $3, $4, 1)
      ON CONFLICT (isbn) DO NOTHING;
    `;
    const values = [book.isbn, book.title, book.author, book.year];

    return this.connection.query(sql, values, (err) => {
      if (err) {
        console.error("Erreur lors de l'ajout du livre :", err);
      } else {
        console.log("Livre ajouté avec succès.");
      }
    });
  }

  async getBooks() {
    let books = [];
    const sql = `SELECT * FROM books;`;

    const result = await this.connection.query(sql);

    if (result.rows) {
      books = result.rows.map((row) => {
        const book = new Book(row.isbn, row.title, row.author, row.year);
        book.availability = row.availability === 1;
        return book;
      });
    }

    return books;
  }

  async searchBook(searchedIsbn) {
    const sql = `SELECT * FROM books WHERE isbn = $1;`;
    const result = await this.connection.query(sql, [searchedIsbn]);

    if (result.rows.length === 0) {
      return null;
    }

    const { isbn, title, author, year, availability } = result.rows[0];

    return new Book(isbn, title, author, year, availability);
  }

  async borrowBook(isbn) {
    const sql = `
      UPDATE books
      SET availability = 0
      WHERE isbn = $1 AND availability = 1;
    `;
    const result = await this.connection.query(sql, [isbn]);

    return result.rowCount > 0;
  }

  async returnBook(isbn) {
    const sql = `
      UPDATE books
      SET availability = 1
      WHERE isbn = $1 AND availability = 0;
    `;
    const result = await this.connection.query(sql, [isbn]);

    return result.rowCount > 0;
  }
}
