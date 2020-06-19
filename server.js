// Dependencies
//=============================
var express = require("express");
var fs = require("fs");
var path = require("path");

// Sets up the Express App
// ============================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the express app to dangle data parsing
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json()); //for parsing application/json



// Routes
// =============================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

//=============API ROUTES==============
// Displays all noteList

// Note taker (DATA)
// ============================

function loadNotes() {
    var notes = JSON.parse( fs.readFileSync( './db/db.json', 'utf8' ) )
    return notes;
}

var noteList = loadNotes();


app.get("/api/notes", function(req, res) {
    console.log(`[GET /api/notes]`)
    res.send(noteList);
});
//================================
// Create New Notes - takes in JSON input

function saveNotes() {
    var notesJSON = JSON.stringify(noteList);
    fs.writeFileSync ("./db/db.json", notesJSON);
};

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    // set new note to have a unique id
    newNote.id = Date.now()
    console.log(`[POST/api/notes]`, newNote);

    noteList.push(newNote);
    saveNotes();

    res.send(newNote);
});

//====================================
// Create Delete
app.delete("/api/notes/:id", function(req, res) {
    const noteId = req.params.id

    noteList = noteList.filter( note=> note.id != noteId)
    // noteList = noteList.filter( function(note){ return note.id !== noteId ? true})

    saveNotes()

    console.log(`[DELETE/api/notes]`)
    res.send({id: noteId, message: `Delete successful ${noteId}`, status: true})
})



// Starts the server to begin listening
// ====================================
app.listen (PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
