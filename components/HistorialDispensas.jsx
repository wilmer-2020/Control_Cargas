import { useState, useEffect } from "react";
import { getData } from "../utils/storage";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  TextField
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";

const HistorialDispensas = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [search, setSearch] = useState(""); // estado para la búsqueda

  const cargarExpedientes = () => {
    setExpedientes(getData("expedientes") || []);
  };

  useEffect(() => {
    cargarExpedientes();
    window.addEventListener("storageUpdated", cargarExpedientes);
    return () => {
      window.removeEventListener("storageUpdated", cargarExpedientes);
    };
  }, []);

  const formatFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString() : "-";

  const expedientesFiltrados = expedientes.filter((exp) => {
    const texto = search.toLowerCase();
    return (
      exp.nombre?.toLowerCase().includes(texto) ||
      exp.placa?.toLowerCase().includes(texto)
    );
  });

  return (
    <Box sx={{ maxWidth: 1200, margin: "2rem auto" }}>
      {/* Encabezado con título y buscador */}
      <Box display={"flex"} justifyContent="center" mb={4}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: "center", color: "#014d77" }}
        >
          📋 Historial de Dispensas
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Buscar por nombre o placa..."
          size="small"
          sx={{ marginLeft: 2, width: 300 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Actualiza búsqueda
        />
      </Box>

      {expedientesFiltrados.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No se encontraron resultados.
        </Typography>
      ) : (
        expedientesFiltrados.map((exp) => (
          <Accordion
            key={exp.id}
            sx={{
              mb: 2,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: "#f5f9ff",
                "&:hover": { bgcolor: "#e3f2fd" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {exp.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🚗 Unidad: {exp.placa} | Total:{" "}
                    {exp.dispensas?.length || 0} dispensas
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {exp.dispensas?.length > 0 ? (
                <Box>
                  {exp.dispensas.map((d, i) => (
                    <Box key={i} sx={{ py: 1.5 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            📅 Date:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {formatFecha(d.fecha)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            ⛽ Amount:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {d.cantidad || "—"}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            📝 Notes:
                          </Typography>
                          <Typography variant="body1">
                            {d.notas || "Sin notas"}
                          </Typography>
                        </Grid>
                      </Grid>

                      {i < exp.dispensas.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  No tiene dispensas registradas.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default HistorialDispensas;
