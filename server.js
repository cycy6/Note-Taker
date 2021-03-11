const express = require('express')
const app = express()
const fs = require('fs')

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"))

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const dbFile = './app/db.json';

let db = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

let noteList = [{id: "0000-0000-0000-0000", title: 'note1', text: 'note1 text'}];

app.listen(PORT, () => {
console.log(`Note taker app listening at http://localhost:${PORT}`)
})

app.get('/notes', (req, res, next) => {
    res.sendFile(__dirname + `/public/notes.html`)
})

app.get('/api/notes', (req, res, next) => {
    console.log(db)
    res.send(db)
})

app.post("/api/notes", (req, res) => {
    // store
    //   .addNote(req.body)
    //   .then((note) => res.json(note))
    //   .catch((err) => res.status(500).json(err));
  
    let newNote = req.body;
    let highestId = 1;
    if (db.length) {
      highestId = Math.max(...db.map((note) => note.id));
      highestId++;
    }
  
    newNote.id = highestId;
    db.push(newNote);
  
    res.json(db);
  
    fs.writeFileSync("db/db.json", JSON.stringify(db));
  });
  
  app.delete("/api/notes/:id", (req, res) => {
    // store
    //   .removeNote(req.params.id)
    //   .then(() => res.json({ ok: true }))
    //   .catch((err) => res.status(500).json(err));
  
    let deleteNote = req.params.id;
    db = db.filter((note) => note.id != deleteNote);
    res.end("Note has been deleted");
  });