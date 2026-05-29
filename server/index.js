//servidor api

///get obtener - post crear - put actualizar - delete eliminar

const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
app.use(cors());
app.use(express.json());    

//ruta para obtener los docentes
app.get('/docentes', (req, res) => {
    const sql = 'SELECT * FROM docentes';
    db.query(sql, (err, results) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            res.status(500).json({ error: 'Error al obtener los docentes' });
            return;
        }
        res.json(results);
    });
});

// ruta 2 obtener un docente por id
app.get('/docentes/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM docentes WHERE id = ?';  
    db.query(sql, [id], (err, results) => {
        if (err) {
            //500 error interno del servidor, fallo la bd
            return res.status(500).json({ error: 'Error al obtener el docente' });

        }
        res.json(results);
    
        if (results.length) {
        //404 no encontrado
        return res.status(404).json({ error: 'Docente no encontrado' });
       }
       res.json(results[0]);
    });   

});


//ruta numero 3 guardar un docente
app.post('/docentes', (req, res) => {
    const { nombre, correo,telefono,titulo,area_academica, dedicacion,años_experiencia,} = req.body;
    if (!nombre?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const años =Number(años_experiencia);
    if (Number.isNaN(años) || años < 0) {
        return res.status(400).json({ error: 'años de experiencia del docente invalidos' });
        }
        const sql = 'INSERT INTO docentes (nombre, correo, telefono, titulo, area_academica, dedicacion, años_experiencia) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nombre.trim(), correo.trim(), telefono.trim(), titulo.trim(), area_academica.trim(), dedicacion.trim(), años, telefono, titulo, area_academica, dedicacion, años], (err, results) => {
            if (err) {
                //500 error interno del servidor, fallo la bd
                return res.status(500).json({ error: 'Error al guardar el docente' });

            }
            res.json({
                id: results.insertId,
                nombre: nombre.trim(),
                correo: correo.trim(),
                telefono: telefono.trim(),
                titulo: titulo.trim(),
                area_academica: area_academica.trim(),
                dedicacion: dedicacion.trim(),
                años_experiencia: años
            });
            
        });
    });

//ruta numero 4 actualizar un docente
app.put('/docentes/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, correo,telefono,titulo,area_academica, dedicacion,años_experiencia,} = req.body;
    if (!nombre?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() ) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const años =Number(años_experiencia);
    if (Number.isNaN(años) || años < 0) {
        return res.status(400).json({ error: 'años de experiencia del docente invalidos' });
    }
    const sql = 'UPDATE docentes SET nombre = ?, correo = ?, telefono = ?, titulo = ?, area_academica = ?, dedicacion = ?, años_experiencia = ? WHERE id = ?';
    db.query(sql, [nombre.trim(), correo.trim(), telefono.trim(), titulo.trim(), area_academica.trim(), dedicacion.trim(), años, id], (err) => {
        if (err) {
                //500 error interno del servidor, fallo la bd
                return res.status(500).json({ error: 'Error al actualizar el docente' });

        }
        res.json({message: 'Docente actualizado correctamente'});
    });
});

//ruta numero 5 eliminar un docente
app.delete('/docentes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM docentes WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
                //500 error interno del servidor, fallo la bd
                return res.status(500).json({ error: 'Error al eliminar el docente' });

        }
        res.json({message: 'Docente eliminado correctamente'});
    });
});

app.listen(3001, () => {
    console.log('Servidor bakend corriendo desde  el puerto 3001');
    
});
   





                



  




