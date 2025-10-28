import dotenv from "dotenv";
import { BookRepository } from "./app/repositories/bookRepository.js";
import { BookView } from "./app/views/bookView.js";

dotenv.config();

const db = new BookRepository();
await db.initialize();

const bookView = new BookView();
bookView.displayMenu();
