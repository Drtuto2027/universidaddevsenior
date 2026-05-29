import { useState, useEffect } from 'react'; 
import './App.css';

function App() {

  // Memoria del formulario - Estados 
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [areaAcademica, setAreaAcademica] = useState('');
  const [dedicacion, setDedicacion] = useState('');
  const [añosExperiencia, setAñosExperiencia] = useState(0);

  const [registros, setRegistros] = useState([]);
  const [editindex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch('http://localhost:3001/docentes');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar los docentes: ' + error);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setTitulo('');
    setAreaAcademica('');
    setDedicacion('');
    setAñosExperiencia(0);
    setEditIndex(null);
  };

  const regitrarDatos = async (e) => {
    e.preventDefault();
    const payload = {
      nombre,
      correo,
      telefono,
      titulo,
      area_academica: areaAcademica,
      dedicacion,
      años_experiencia: añosExperiencia
    };

    if (editindex !== null) {
      // Camino de ACTUALIZAR
      try {
        const docenteId = registros[editindex].id;
        const response = await fetch(`http://localhost:3001/docentes/${docenteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const nuevosRegistros = [...registros];
          nuevosRegistros[editindex] = { 
            ...registros[editindex], 
            ...payload 
          };
          setRegistros(nuevosRegistros);
          setEditIndex(null);
          alert('Docente actualizado correctamente');
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || 'Error al actualizar el docente');
        }
      } catch (error) {
        alert('Error de conexión al actualizar el docente');
      }
    } else {
      try { 
        // Camino de GUARDAR
        const response = await fetch('http://localhost:3001/docentes', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok) {
          setRegistros([...registros, data]);
          alert('Docente registrado correctamente');
        } else {
          alert(data.error || 'Error al guardar el docente');
        }
      } catch (error) {
        alert('Error de conexión al guardar');
      }
    }
    limpiarFormulario();
  };

  const eliminarRegistro = async (index) => {
    const docente = registros[index];
    try {
      const response = await fetch(`http://localhost:3001/docentes/${docente.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== index));
        if (editindex === index) {
          setEditIndex(null);
          limpiarFormulario();
        }   
        alert('Docente eliminado correctamente');
      } else {
        alert('Error al eliminar el docente');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const editarRegistro = (index) => {
    const reg = registros[index];
    setNombre(reg.nombre);
    setCorreo(reg.correo);
    setTelefono(reg.telefono);
    setTitulo(reg.titulo);
    setAreaAcademica(reg.area_academica);
    setDedicacion(reg.dedicacion);
    setAñosExperiencia(reg.años_experiencia);
    setEditIndex(index);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gestión de docentes universitarios</h1>
        <p>Registro de profesores: datos académicos y de contacto</p>
      </header>

      {/* Sección del Formulario */}
      <section className="form-container">
        <form onSubmit={regitrarDatos} className="docente-form">
          <h2>{editindex !== null ? 'Modificar Registro' : 'Nuevo Docente'}</h2>
          
          <div className="grid-inputs">
            <div className="field">
              <label>Nombre completo:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej. María Fernanda López" />
            </div>

            <div className="field">
              <label>Correo institucional:</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required placeholder="nombre@universidad.edu" />
            </div>

            <div className="field">
              <label>Teléfono:</label>
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required placeholder="+57 300 1234567" />
            </div>

            <div className="field">
              <label>Título académico máximo:</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ej. Doctorado, Maestría..." />
            </div>

            <div className="field">
              <label>Área o programa académico:</label>
              <input type="text" value={areaAcademica} onChange={(e) => setAreaAcademica(e.target.value)} required placeholder="Ej. Ingeniería de Software" />
            </div>

            <div className="field">
              <label>Dedicación:</label>
              <select value={dedicacion} onChange={(e) => setDedicacion(e.target.value)} required>
                <option value="">Seleccione dedicación</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Cátedra">Cátedra</option>
              </select>
            </div>

            <div className="field">
              <label>Años de experiencia docente:</label>
              <input type="number" value={añosExperiencia} onChange={(e) => setAñosExperiencia(e.target.value)} required min="0" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editindex !== null ? 'Actualizar Registro' : 'Registrar'}
            </button>
            {editindex !== null && (
              <button type="button" className="btn-cancel" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabla de Resultados */}
      <section className="table-container">
        <table className="docente-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Título</th>
              <th>Área académica</th>
              <th>Dedicación</th>
              <th>Años doc.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length > 0 ? (
              registros.map((doc, index) => (
                <tr key={doc.id || index}>
                  <td>{doc.nombre}</td>
                  <td>{doc.correo}</td>
                  <td>{doc.telefono}</td>
                  <td>{doc.titulo}</td>
                  <td>{doc.area_academica}</td>
                  <td>{doc.dedicacion}</td>
                  <td>{doc.años_experiencia}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => editarRegistro(index)}>Editar</button>
                    <button className="btn-delete" onClick={() => eliminarRegistro(index)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No hay docentes registrados actualmente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;