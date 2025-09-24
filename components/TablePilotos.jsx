import { useState, useEffect } from "react";
import { getData, removeData } from "../utils/storage";
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
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import SearchIcon from "@mui/icons-material/Search";
import { LuClipboardList } from "react-icons/lu";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

export default function TablaPilotos() {
  const [Pilotos, setPilotos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarPilotos = () => setPilotos(getData("pilotos"));

  const handleDelete = (id) => removeData("pilotos", id);

  useEffect(() => {
    cargarPilotos();
    window.addEventListener("storageUpdated", cargarPilotos);
    return () => {
      window.removeEventListener("storageUpdated", cargarPilotos);
    };
  }, []);

  const pilotosFiltrados = Pilotos.filter(
    (p) =>
      p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.Placa.toLowerCase().includes(busqueda.toLowerCase())
  );

  function toggleEstado(id) {
    const actualizados = Pilotos.map((p) =>
      p.id === id ? { ...p, estado: !p.estado } : p
    );
    localStorage.setItem("pilotos", JSON.stringify(actualizados));
    window.dispatchEvent(new Event("storageUpdated"));
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#ffffff",
        boxShadow: 1,
        width: "80%",
        margin: "auto",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <LuClipboardList color="#059669" size={"22px"} />
          <Typography variant="h5" fontWeight="bold" color="#059669">
            Lista de Pilotos
          </Typography>
        </Box>
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
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon htmlColor="#059669" />
                    <strong>Nombre</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalShippingIcon htmlColor="#059669" />
                    <strong>Unidad</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <InfoIcon htmlColor="#059669" />
                    <strong>Estado</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon htmlColor="#059669" />
                    <strong>Fecha de Registro</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                   <HiOutlineMenuAlt3 color="#059669" />
                    <strong>Acciones</strong>
                  </Box>
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
                      label={p.estado ? "ACTIVO" : "INACTIVO"}
                      color={p.estado ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: "bold", color: "#fff" }}
                    />
                  </TableCell>
                  <TableCell>{p.fechaRegistro}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => toggleEstado(p.id)}
                      startIcon={p.estado ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      sx={{
                        textTransform: "uppercase",
                        mr: 1,
                        bgcolor: p.estado ? "#10b981" : "#ef4444",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: p.estado ? "#059669" : "#dc2626",
                        },
                      }}
                    >
                      {p.estado ? "Inhabilitar" : "Habilitar"}
                    </Button>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(p.id)}
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
