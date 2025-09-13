
import { useState } from "react";
import { getData, saveData } from "../utils/storage";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";

export default function FormularioPiloto() {
const [Nombre, setNombre] = useState("")
const [Placa, setPlaca] = useState("")

  const handleSubmit = () => {
    if (!Nombre || !Placa) {
      alert("Por favor ingresa nombre y placa");
      return;
    }

    const pilotos = getData("pilotos");
    const nuevo = {
      id: Date.now(),
      Nombre,
      Placa,
      estado: true,
      fechaRegistro: new Date().toLocaleDateString(),
    };

    saveData("pilotos", [...pilotos, nuevo]);

    setNombre("");
    setPlaca("");
    alert("✅ Piloto registrado!");
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#f9fbfd",
        boxShadow: 1,
        maxWidth: 400,
        width: '20%',
      }}
    >
      <CardContent>
        {/* Título */}
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#059669"
          gutterBottom
        >
          Registrar Piloto
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
         Complete la información del piloto y su unidad
        </Typography>

        {/* Select Piloto */}
        <TextField
          fullWidth
          label="Piloto"
          defaultValue=""
          margin="normal"
          value={Nombre}
          onChange={(e) => setNombre(e.target.value)}
        >
        </TextField>

        {/* Select Tipo de Movimiento */}
        <TextField
          fullWidth
          label="Placa de unidad"
          defaultValue=""
          margin="normal"
            value={Placa}
            onChange={(e) => setPlaca(e.target.value)}
        >
        
        </TextField>

        {/* Botón */}
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#059669",
              "&:hover": { bgcolor: "#047857" },
              borderRadius: 1.5,
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
          >
            Registrar Piloto
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
