import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const getChipColor = (estado) => {
  return estado ? "#059668d3" : "#c80000ff"; // Verde si activo, rojo si inactivo
};

export default function MovimientosPorPiloto() {
  const [pilotos, setPilotos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  // Cargar pilotos y movimientos desde localStorage
  const cargarDatos = () => {
    const pilotosGuardados = JSON.parse(localStorage.getItem("pilotos")) || [];
    const movimientosGuardados =
      JSON.parse(localStorage.getItem("movimientos")) || [];

    const resumen = pilotosGuardados.map((p) => {
      const movsPiloto = movimientosGuardados.filter(
        (m) => m.piloto === p.Nombre
      );

      const Circuito = movsPiloto.filter(
        (m) => m.tipoMovimiento === "Circuito"
      ).length;
      const naviero = movsPiloto.filter(
        (m) => m.tipoMovimiento === "naviero"
      ).length;

      return {
        nombre: p.Nombre,
        codigo: p.Placa || "N/A",
        estado: p.estado ?? true, // usa la propiedad estado (boolean)
        total: Circuito + naviero,
        Circuito,
        naviero,
      };
    });

    setPilotos(resumen);
    setMovimientos(movimientosGuardados);
  };

  useEffect(() => {
    cargarDatos();
    window.addEventListener("storageUpdated", cargarDatos);

    return () => {
      window.removeEventListener("storageUpdated", cargarDatos);
    };
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "#ffffffff",
        boxShadow: 1,
        width: "75%",
      }}
    >
      <CardContent>
        {/* Título */}
        <Box display="flex" alignItems="center" mb={1}>
          <PersonIcon sx={{ color: "#059669", mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="#059669">
            Movimientos por Piloto
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Conteo de movimientos de cada piloto por tipo
        </Typography>

        {/* Lista de pilotos */}
        {pilotos.map((p, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              p: 2,
              mb: 2,
              bgcolor: "#fff",
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              {/* Nombre + Código */}
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {p.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.codigo}
                </Typography>
              </Grid>

              {/* Estado + Conteos a la derecha */}
              <Grid
                item
                xs={6}
                container
                alignItems="center"
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Chip
                    label={p.estado ? "Activo" : "Inactivo"}
                    size="small"
                    sx={{ fontWeight: "bold", color: "#fff",backgroundColor: getChipColor(p.estado) }}
                  />
                </Grid>

                {/* Totales */}
                <Grid item>
                  <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ color: "#059669" }}>
                    {p.total}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                    color="text.secondary"
                  >
                    Total
                  </Typography>
                </Grid>
                
                <Grid item>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ color: "#010101ff" }}
                  >
                    {p.Circuito}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                    color="text.secondary"
                  >
                    Circuito
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ color: "#0088ccff" }}
                  >
                    {p.naviero}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                    color="text.secondary"
                  >
                    Naviero
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        ))}

        {pilotos.length === 0 && (
          <Typography variant="body2" align="center" color="text.secondary">
            No hay pilotos registrados
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
