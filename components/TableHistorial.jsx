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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import { LuContainer } from "react-icons/lu";
import { FaRegListAlt } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RiFileExcel2Line } from "react-icons/ri";

export default function TablaHistorial() {
  const [movimientos, setMovimientos] = useState(
    JSON.parse(localStorage.getItem("movimientos")) || []
  );
  const [pilotos, setPilotos] = useState(
    JSON.parse(localStorage.getItem("pilotos")) || []
  );
  const [busqueda, setBusqueda] = useState("");

  // Eliminar un movimiento por id
  const handleEliminar = (id) => {
    const filtrados = movimientos.filter((mov) => mov.id !== id);
    setMovimientos(filtrados);
    localStorage.setItem("movimientos", JSON.stringify(filtrados));
    window.dispatchEvent(new Event("storageUpdated"));
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

  // Obtener la placa del cabezal según el piloto
  const obtenerCabezal = (nombrePiloto) => {
    const piloto = pilotos.find((p) => p.Nombre === nombrePiloto);
    return piloto ? piloto.Placa : "N/A";
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const datosExportar = movimientosFiltrados.map((m) => ({
      Piloto: m.piloto,
      Cabezal: obtenerCabezal(m.piloto),
      "Unidad Movida": m.placaContenedor,
      Tipo: m.tipoMovimiento,
      Fecha: m.fecha,
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Movimientos");

    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "movimientos.xlsx");
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#ffffff",
        boxShadow: 1,
        width: "95%",
        margin: "auto",
      }}
    >
      <CardContent>
      <Box display="flex" alignItems="center" mb={1} gap={2}>
        <FaRegListAlt color="#059669" size={'20px'}/>
        <Typography variant="h5" fontWeight="bold" color="#059669">
          Movimientos de Pilotos
        </Typography>
      </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Gestione los movimientos realizados por los pilotos
        </Typography>

        {/* Búsqueda + Exportar */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            size="small"
            label="Buscar por piloto o unidad"
            variant="outlined"
            value={busqueda}
            sx={{ width: "250px" }}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button variant="contained" color="success" onClick={exportarExcel} startIcon={<RiFileExcel2Line />}>
            Exportar a Excel
          </Button>
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
                    <strong>Cabezal</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LuContainer color="#059669" size={'25px'}/>
                    <strong>Unidad Movida</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <InfoIcon htmlColor="#059669" />
                    <strong>Tipo</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon htmlColor="#059669" />
                    <strong>Fecha</strong>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                  <HiOutlineMenuAlt3 color="#059669"/>
                    <strong>Acciones</strong>
                  </Box>
                </TableCell>
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
