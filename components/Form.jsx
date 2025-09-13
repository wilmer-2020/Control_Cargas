import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { getData } from "../utils/storage";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function FormularioMovimiento() {
  const [Pilotos, setPilotos] = useState([]);

  const [Movimientos, setMovimientos] = useState(() => {
  const guardados = localStorage.getItem("movimientos");
  return guardados ? JSON.parse(guardados) : [];
});

  const [Data, setData] = useState({
    piloto: "",
    tipoMovimiento: "",
    fecha: new Date().toLocaleString(),
    placaContenedor: "",
  });

  const tipos = [
    { label: "Circuito", value: "Circuito" },
    { label: "Naviero", value: "naviero" },
  ];

  const cargarPilotos = () => {
    setPilotos(getData("pilotos"));
  };

  const hanleChange = (e) => {
    setData({
      ...Data,
      [e.target.name]: e.target.value,
      id: uuid(),
    });
  };

  const handlesubmit = (e) => {
  e.preventDefault();
  console.log(Data);

  const nuevosMovimientos = [...Movimientos, Data];
  setMovimientos(nuevosMovimientos);
  localStorage.setItem("movimientos", JSON.stringify(nuevosMovimientos));
  window.dispatchEvent(new Event("storageUpdated"));

  setData({
    piloto: "",
    tipoMovimiento: "",
    fecha: new Date().toLocaleString(),
    placaContenedor: "",
  });
};

  useEffect(() => {
    cargarPilotos();
    window.addEventListener("storageUpdated", cargarPilotos);

    return () => {
      window.removeEventListener("storageUpdated", cargarPilotos);
    };
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#f9fbfd",
        boxShadow: 1,
        maxWidth: 400,
        width: "20%",
      }}
    >
      <CardContent>
        {/* Título */}
        <Typography variant="h6" fontWeight="bold" color="#059669" gutterBottom>
          Registrar Movimiento
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Registre un nuevo movimiento para un piloto
        </Typography>

        {/* Select Piloto */}
        <TextField
          fullWidth
          select
          label="Piloto"
          name="piloto"
          value={Data.piloto}
          margin="normal"
          onChange={hanleChange}
        >
          {Pilotos.map((option, index) => (
            <MenuItem key={index} value={option.Nombre}>
              {option.Nombre}
            </MenuItem>
          ))}
        </TextField>

        {/* Select Tipo de Movimiento */}
        <TextField
          fullWidth
          select
          label="Tipo de Movimiento"
          defaultValue=""
          margin="normal"
          name="tipoMovimiento"
          value={Data.tipoMovimiento}
          onChange={hanleChange}
        >
          {tipos.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Fecha */}

        {/* Placa del contenedor */}
        <TextField
          fullWidth
          label="Placa del Contenedor"
          placeholder="Ingrese la placa"
          margin="normal"
          name="placaContenedor"
          value={Data.placaContenedor}
          onChange={hanleChange}
        />

        {/* Botón */}
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handlesubmit}
            sx={{
              bgcolor: "#059669",
              "&:hover": { bgcolor: "#047857" },
              borderRadius: 1.5,
              fontWeight: "bold",
            }}
          >
            Registrar Movimiento
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
