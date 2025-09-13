import { useState, useEffect } from "react";
import { getData } from "../utils/storage";
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
  Chip,
  Button,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export default function TablaPilotos() {
  const [Pilotos, setPilotos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarPilotos = () => {
    setPilotos(getData("pilotos"));
  };

  function eliminarPiloto(id) {
    const pilotos = JSON.parse(localStorage.getItem("pilotos")) || [];
    const pilotosActualizados = pilotos.filter((piloto) => piloto.id !== id);
    localStorage.setItem("pilotos", JSON.stringify(pilotosActualizados));
    cargarPilotos();
  }

  useEffect(() => {
    cargarPilotos();
    window.addEventListener("storageUpdated", cargarPilotos);

    return () => {
      window.removeEventListener("storageUpdated", cargarPilotos);
    };
  }, []);

  // Filtrar pilotos según búsqueda
  const pilotosFiltrados = Pilotos.filter(
    (p) =>
      p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.Placa.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#f9fbfd",
        boxShadow: 1,
        width: "80%",
      }}
    >
      <CardContent>
        {/* Título */}
        <Typography variant="h6" fontWeight="bold" color="#059669" gutterBottom>
          Lista de Pilotos
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Gestione los pilotos registrados en el sistema
        </Typography>

        {/* Input de búsqueda */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Buscar por nombre o placa del cabezal"
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
                <TableCell>
                  <strong>Nombre</strong>
                </TableCell>
                <TableCell>
                  <strong>Placa</strong>
                </TableCell>
                <TableCell>
                  <strong>Estado</strong>
                </TableCell>
                <TableCell>
                  <strong>Fecha de Registro</strong>
                </TableCell>
                <TableCell>
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pilotosFiltrados.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.Nombre}</TableCell>
                  <TableCell>{p.Placa}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.estado ? "Activo" : "Inactivo"}
                      color="success"
                      size="small"
                      sx={{ fontWeight: "bold", color: "#fff" }}
                    />
                  </TableCell>
                  <TableCell>{p.fechaRegistro}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityOffOutlinedIcon />}
                      sx={{
                        textTransform: "none",
                        mr: 1,
                        borderColor: "#d1d5db",
                        color: "#374151",
                        "&:hover": { borderColor: "#9ca3af" },
                      }}
                    >
                      Desactivar
                    </Button>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => eliminarPiloto(p.id)}
                      sx={{
                        border: "1px solid #fca5a5",
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#fee2e2" },
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {pilotosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay pilotos registrados
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
