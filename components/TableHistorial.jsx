import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function TablaHistorial() {
  const [movimientos, setMovimientos] = useState(
    JSON.parse(localStorage.getItem("movimientos")) || []
  );
  const [pilotos, setPilotos] = useState(
    JSON.parse(localStorage.getItem("pilotos")) || []
  );
  const [busqueda, setBusqueda] = useState("");

  // Función para eliminar un movimiento por id
  const handleEliminar = (id) => {
    const filtrados = movimientos.filter((mov) => mov.id !== id);
    setMovimientos(filtrados);
    localStorage.setItem("movimientos", JSON.stringify(filtrados));
    window.dispatchEvent(new Event("storageUpdated")); // notificar a otros componentes
  };

  // Escuchar cambios en localStorage
  useEffect(() => {
    const actualizar = () => {
      setMovimientos(JSON.parse(localStorage.getItem("movimientos")) || []);
      setPilotos(JSON.parse(localStorage.getItem("pilotos")) || []);
    };
    window.addEventListener("storageUpdated", actualizar);
    return () => window.removeEventListener("storageUpdated", actualizar);
  }, []);

  // Filtrar movimientos según búsqueda
  const movimientosFiltrados = movimientos.filter(
    (m) =>
      m.piloto.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.placaContenedor.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para obtener la placa del cabezal según el piloto
  const obtenerCabezal = (nombrePiloto) => {
    const piloto = pilotos.find((p) => p.Nombre === nombrePiloto);
    return piloto ? piloto.Placa : "N/A";
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#f9fbfd",
        boxShadow: 1,
        width: "95%",
        margin: "auto",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#059669"
          gutterBottom
        >
          Movimientos de Pilotos
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Gestione los movimientos realizados por los pilotos
        </Typography>

        {/* Input de búsqueda */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Buscar por piloto o unidad"
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Cabezal</strong></TableCell>
                <TableCell><strong>Unidad Movida</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientosFiltrados.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.piloto}</TableCell>
                  <TableCell>{obtenerCabezal(p.piloto)}</TableCell>
                  <TableCell>{p.placaContenedor}</TableCell>
                  <TableCell>{p.tipoMovimiento}</TableCell>
                  <TableCell>{p.fecha}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      variant="contained"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => handleEliminar(p.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {movimientosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay movimientos registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
