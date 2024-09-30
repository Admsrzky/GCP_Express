const express = require('express');
const bodyParser = require('body-parser');
const { Mahasiswa, sequelize } = require('./models');  // Import model Mahasiswa dan koneksi Sequelize
const app = express();
const port = process.env.PORT || 8080;

// Set view engine and public folder
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Test koneksi database saat aplikasi dimulai
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Routes
app.get('/', async (req, res) => {
    try {
        const mahasiswa = await Mahasiswa.findAll(); // Menggunakan Sequelize untuk mendapatkan semua data
        if (mahasiswa.length === 0) {
            console.log('No data found in the mahasiswa table.');
        }
        res.render('index', { mahasiswa });
    } catch (error) {
        console.error('Error in / route:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    try {
        const { nama, jurusan } = req.body;
        if (!nama || !jurusan) {
            return res.status(400).send('Nama and Jurusan are required');
        }
        await Mahasiswa.create({ nama, jurusan });  // Menggunakan Sequelize untuk create
        res.redirect('/?success=true'); // Redirect dengan parameter success
    } catch (error) {
        console.error('Error in /create route:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const mahasiswa = await Mahasiswa.findByPk(req.params.id);  // Menggunakan Sequelize untuk mencari mahasiswa berdasarkan id
        if (!mahasiswa) {
            return res.status(404).send('Mahasiswa not found');
        }
        res.render('edit', { mahasiswa });
    } catch (error) {
        console.error('Error in /edit/:id route:', error);
        res.status(500).send('Server Error');
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        const { nama, jurusan } = req.body;
        if (!nama || !jurusan) {
            return res.status(400).send('Nama and Jurusan are required');
        }
        const updated = await Mahasiswa.update({ nama, jurusan }, { where: { id: req.params.id } });  // Menggunakan Sequelize untuk update
        if (updated[0] === 0) {
            return res.status(404).send('Mahasiswa not found');
        }
        res.redirect('/?success=true'); // Redirect dengan parameter success
    } catch (error) {
        console.error('Error in /edit/:id route:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const deleted = await Mahasiswa.destroy({ where: { id: req.params.id } });  // Menggunakan Sequelize untuk delete
        if (deleted === 0) {
            return res.status(404).send('Mahasiswa not found');
        }
        res.redirect('/?success=true'); // Redirect dengan parameter success
    } catch (error) {
        console.error('Error in /delete/:id route:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
