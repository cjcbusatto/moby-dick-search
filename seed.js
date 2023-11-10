const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./mobydick.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log("[DB] Connected!");
    }
  },
);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY, 
    chapterId TEXT, 
    paragraphId NUMERIC, 
    paragraph TEXT)`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("[DB] Table book created");

      db.run(`DELETE FROM book`, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("[DB] Table book cleared");

        // Import JSON file
        const bookChapters = require("./MobyDick.json");

        for (let i = 0; i < bookChapters.length; i++) {
          for (let j = 0; j < bookChapters[i].paragraphs.length; j++) {
            const stmt = `INSERT INTO book (chapterId, paragraphId, paragraph) VALUES (?, ?, ?)`;
            db.run(
              stmt,
              [i + 1, j + 1, bookChapters[i].paragraphs[j]],
              (err) => {
                if (err) {
                  return console.error(err.message);
                }
                const id = this.lastID;
                console.log(`Added todo item with id ${id}`);
              },
            );
          }
        }
      });
    },
  );
});
