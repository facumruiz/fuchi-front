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
      posicionNatural: "",
      perfilHabil: "",
      estado: "",
    },
  });

  const handleInputChange = (e, category, field) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: e.target.value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log(JSON.stringify(formData, null, 2));
    setIsOpen(false);
  };

  return (
    <div className="">
      <Button variant="primary" disabled onClick={() => setIsOpen(true)}>
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
            <Form.Group className="mb-3">
              <Form.Label>Posición Natural</Form.Label>
              <Form.Control
                type="text"
                placeholder="Posición Natural"
                value={formData.perfilFutbolistico.posicionNatural}
                onChange={(e) => handleInputChange(e, "perfilFutbolistico", "posicionNatural")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Perfil Hábil</Form.Label>
              <Form.Control
                type="text"
                placeholder="Perfil Hábil"
                value={formData.perfilFutbolistico.perfilHabil}
                onChange={(e) => handleInputChange(e, "perfilFutbolistico", "perfilHabil")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Estado"
                value={formData.perfilFutbolistico.estado}
                onChange={(e) => handleInputChange(e, "perfilFutbolistico", "estado")}
              />
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
