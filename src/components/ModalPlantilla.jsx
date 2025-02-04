import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./ModalPlantilla.css"; // Archivo CSS personalizado

const ModalPlantilla = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    datosPersonales: {
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      primeraNacionalidad: "",
    },
    perfilFutbolistico: {
      posicionNatural: "", // Inicializamos como vacío
      perfilHabil: "",
      estado: "", // Aquí se guarda el estado
    },
  });

  const positionEnum = [
    'ST',  // Striker (Delantero)
    'LM',  // LeftMidfielder (Centrocampista izquierdo)
    'CM',  // CentralMidfielder (Centrocampista central)
    'RM',  // RightMidfielder (Centrocampista derecho)
    'LB',  // LeftBack (Lateral izquierdo)
    'CB',  // CenterBack (Defensa central)
    'RB',  // RightBack (Lateral derecho)
    'GK',  // Goalkeeper (Portero)
    'CAM', // AttackingMidfielder (Centrocampista ofensivo)
    'LWB', // LeftWingBack (Lateral izquierdo avanzado)
    'RWB', // RightWingBack (Lateral derecho avanzado)
    'CDM', // DefensiveMidfielder (Centrocampista defensivo)
    'LAM', // LeftAttackingMidfielder (Centrocampista ofensivo izquierdo)
    'RAM', // RightAttackingMidfielder (Centrocampista ofensivo derecho)
  ];

  const handleInputChange = (e, category, field) => {
    
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: e.target.value,
      },
    }));
  };

  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/player`;

  const handleSubmit = async () => {
    try {
      const jugadores = [formData]; // Convertir en array

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jugadores),
      });

      console.log("Datos enviados:", jugadores);

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        alert("Datos guardados exitosamente");
      } else {
        console.error("Error en la respuesta del servidor:", data);
        alert(`Error: ${data.error || "Error desconocido"}`);
      } 
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <div className="">
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
        </svg>
      </Button>

      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered className="custom-modal">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <h5>Datos Personales</h5>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={formData.datosPersonales.nombre}
                onChange={(e) => handleInputChange(e, "datosPersonales", "nombre")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellido"
                value={formData.datosPersonales.apellido}
                onChange={(e) => handleInputChange(e, "datosPersonales", "apellido")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                value={formData.datosPersonales.fechaNacimiento}
                onChange={(e) => handleInputChange(e, "datosPersonales", "fechaNacimiento")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Primera Nacionalidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Primera Nacionalidad"
                value={formData.datosPersonales.primeraNacionalidad}
                onChange={(e) => handleInputChange(e, "datosPersonales", "primeraNacionalidad")}
              />
            </Form.Group>

            <h5>Perfil Futbolístico</h5>

            {/* Posición Natural con opciones del enum */}
            <Form.Group className="mb-3">
              <Form.Label>Posición Natural</Form.Label>
              <Form.Control
                as="select"
                value={formData.perfilFutbolistico.posicionNatural || ''} // Aseguramos que no esté vacío
                onChange={(e) => handleInputChange(e, "perfilFutbolistico", "posicionNatural")}
              >
                <option value="">Seleccione una posición</option> {/* Opcional, para mostrar un mensaje de "Seleccione" */}
                {positionEnum.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Perfil Hábil */}
            <Form.Group className="mb-3">
              <Form.Label>Perfil Hábil</Form.Label>
              <Form.Control
                as="select"
                value={formData.perfilFutbolistico.perfilHabil}
                onChange={(e) => handleInputChange(e, 'perfilFutbolistico', 'perfilHabil')}
              >
                <option value="Izquierdo">Izquierdo</option>
                <option value="Derecho">Derecho</option>
                <option value="Ambidiestro">Ambidiestro</option>
              </Form.Control>
            </Form.Group>

            {/* Estado */}
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={formData.perfilFutbolistico.estado}
                onChange={(e) => handleInputChange(e, "perfilFutbolistico", "estado")}
              >
                <option value="">Seleccione un estado</option>
                <option value="Titular">Titular</option>
                <option value="Suplente">Suplente</option>
                <option value="Lesionado">Lesionado</option>
                <option value="Preseleccionado">Preseleccionado</option>
                <option value="Desafectado">Desafectado</option>
                <option value="Suspendido">Suspendido</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalPlantilla;
