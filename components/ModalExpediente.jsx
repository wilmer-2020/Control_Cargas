import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState} from "react";
import { Card, CardContent,TextField, MenuItem } from "@mui/material";
import { v4 as uuid } from "uuid";
import { getData, saveData } from "../utils/storage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #c7c7c7ff",
  boxShadow: 24,
  p: 4,
};

const ModalExpediente = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [pilotos, setPilotos] = useState(getData("pilotos"));
  const [expedientes, setExpedientes] = useState(() =>
    JSON.parse(localStorage.getItem("expedientes")) || []
  );
  const [formData, setFormData] = useState({
    pilotoId: "",
    nombre: "",
    placa: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    const piloto = pilotos.find(p => p.id === value);

    setFormData({
      pilotoId: piloto.id,
      nombre: piloto.Nombre,
      placa: piloto.Placa,
    });
  };

  const handleSubmit = () => {
    const nuevo = {
      id: uuid(),
      pilotoId: formData.pilotoId,
      nombre: formData.nombre,
      placa: formData.placa,
      estado: "Pendiente",
      fechaInicio: new Date().toISOString(),
      dispensas: [],
    };

    const actualizados = [...expedientes, nuevo];
    setExpedientes(actualizados);
    saveData("expedientes", actualizados);
    alert("✅ Expediente creado!"); 
    setOpen(false);
  };
  return (
    <div>
      <Button 
      variant="contained"
      sx={{ mb: 2, }}
      onClick={handleOpen}>CREAR EXPEDIENTE</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
      
        <Card sx={style}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Crear Expediente
        </Typography>
        <TextField
          select
          fullWidth
          label="Seleccionar Piloto"
          value={formData.pilotoId}
          onChange={handleChange}
          margin="normal"
        >
          {pilotos.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.Nombre} - {p.Placa}
            </MenuItem>
          ))}
        </TextField>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={!formData.pilotoId}
        >
          Crear Expediente
        </Button>
      </CardContent>
    </Card>
      </Modal>
    </div>
  );
};

export default ModalExpediente;
