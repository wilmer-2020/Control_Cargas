import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import PilotCard from "./PilotCard";
import { getData, removeData } from "../utils/storage";
const PilotList = () => {
  const [expedientes, setExpedientes] = useState([]);

  const cargarExpedientes = () => setExpedientes(getData("expedientes"));

  useEffect(() => {
    cargarExpedientes();
    window.addEventListener("storageUpdated", cargarExpedientes);
    return () => {
      window.removeEventListener("storageUpdated", cargarExpedientes);
    };
  }, []);

  const handleDeleteExpediente = (id) => {
    removeData("expedientes", id);
    window.location.reload();
  };

  return (
    <Grid container spacing={3}>
      {expedientes.map((exp) => (
        <Grid item xs={12} sm={6} md={4} key={exp.id}>
          <PilotCard
            nombre={exp.nombre}
            unidad={exp.placa}
            id={exp.id}
            ultimaDispensa={exp.ultimaDispensa}
            fechaSiguienteDispensa={exp.fechaSiguienteDispensa}
            dispensas={exp.dispensas}
            onDelete={handleDeleteExpediente}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PilotList;
