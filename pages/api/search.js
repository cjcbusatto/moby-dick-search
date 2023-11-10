import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export default async function handler(req, res) {
  if (!db) {
    db = await open({
      filename: "./mobydick.db",
      driver: sqlite3.Database,
    });
  }

  const results = await db.all(
    `SELECT * FROM book WHERE paragraph LIKE ? LIMIT 1`,
    [`%${req.query.term}%`],
  );
  console.log(results);

  if (!results.length) {
    const fullBook = await db.all(`SELECT * FROM book`);

    console.log(fullBook);
    return res
      .status(200)
      .json(fullBook.map((chapter) => chapter.paragraph).join("<br /><br />"));
  }
  const paragraph = results.length > 0 ? results[0].paragraph : "";

  res
    .status(200)
    .json(
      paragraph.replace(req.query.term, `<strong>${req.query.term}</strong>`),
    );
}
