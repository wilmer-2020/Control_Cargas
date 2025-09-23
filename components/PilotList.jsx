import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import PilotCard from "./PilotCard";
import { getData } from "../utils/storage";

const PilotList = () => {
  const [expedientes, setExpedientes] = useState([]);
  const cargarExpedientes = () => setExpedientes(getData("expedientes"));

  const handleDeleteExpediente = (id) => {
  setExpedientes(prev => prev.filter(e => e.id !== id)); // 🔹 sincroniza el estado
};


  useEffect(() => {
    cargarExpedientes();

    window.addEventListener("storageUpdated", cargarExpedientes);
    return () => {
      window.removeEventListener("storageUpdated", cargarExpedientes);
    };
  }, []);

  return (
    <Grid container spacing={3}>
      {expedientes.map((exp) => (
        <Grid item xs={12} sm={6} md={4} key={exp.idPiloto}>
        <PilotCard
            nombre={exp.nombre}
            unidad={exp.placa}
            id={exp.id} 
            ultimaDispensa={exp.ultimaDispensa}
            diasRestantes={exp.diasRestantes}
            dispensas={exp.dispensas}
            onDelete-={handleDeleteExpediente}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PilotList;
