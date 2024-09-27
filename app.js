const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db_config');
const app = express();
const port = process.env.PORT || 8080;

// Set view engine and public folder
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM mahasiswa';
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { mahasiswa: results });
    });
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    const { nama, jurusan } = req.body;
    const sql = 'INSERT INTO mahasiswa (nama, jurusan) VALUES (?, ?)';
    connection.query(sql, [nama, jurusan], (err) => {
        if (err) throw err;
        res.redirect('/?success=true'); // Redirect dengan parameter success
    });
});


app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM mahasiswa WHERE id = ?';
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { mahasiswa: result[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { nama, jurusan } = req.body;
    const sql = 'UPDATE mahasiswa SET nama = ?, jurusan = ? WHERE id = ?';
    connection.query(sql, [nama, jurusan, req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/?success=true'); // Redirect dengan parameter success
    });
});


app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM mahasiswa WHERE id = ?';
    connection.query(sql, [req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/?success=true'); // Redirect dengan parameter success
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
