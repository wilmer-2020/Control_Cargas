import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Button } from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useState } from 'react';
import Swal from 'sweetalert2';

const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: 300,
  margin: 'auto',
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

const PilotCard = ({ nombre, id, ultimaDispensa, fechaSiguienteDispensa, unidad, onDelete }) => {
  const [estado, setEstado] = useState(ultimaDispensa ? "Dispensado" : "Pendiente");
  const [siguiente, setSiguiente] = useState(fechaSiguienteDispensa || null);

  const formatFecha = (fecha) => fecha ? new Date(fecha).toLocaleString() : "-";

  const handleDispensar = () => {
    const ahora = new Date();

    if (siguiente && ahora < new Date(siguiente)) {
      Swal.fire({
        icon: 'info',
        title: 'Aún no le toca',
        text: `La próxima dispensa es el ${formatFecha(siguiente)}`,
      });
      return;
    }

    // Calcular fecha siguiente dispensa
    const nuevaFechaSiguiente = new Date();
    nuevaFechaSiguiente.setDate(nuevaFechaSiguiente.getDate() + 6);

    // Actualizar storage
    const expedientes = JSON.parse(localStorage.getItem("expedientes")) || [];
    const actualizado = expedientes.map(exp => {
      if (exp.id === id) {
        const nuevaDispensa = {
          fecha: ahora.toISOString(),
          unidad,
        };
        return {
          ...exp,
          ultimaDispensa: ahora.toISOString(),
          fechaSiguienteDispensa: nuevaFechaSiguiente.toISOString(),
          dispensas: [...(exp.dispensas || []), nuevaDispensa],
        };
      }
      return exp;
    });
    localStorage.setItem("expedientes", JSON.stringify(actualizado));

    // Actualizar estado local
    setEstado("Dispensado");
    setSiguiente(nuevaFechaSiguiente.toISOString());
   

    Swal.fire({
      icon: 'success',
      title: 'Dispensado',
      text: `Próxima dispensa: ${formatFecha(nuevaFechaSiguiente)}`,
    });
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <CardContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: '#E0F2FF', color: '#1976D2' }}>
          <PersonOutlinedIcon />
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h5" fontWeight="bold">{nombre}</Typography>
          <Typography variant="body2" color="text.secondary">PLACA UNIDAD: {unidad}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" color="#607d8b">Estado Actual</Typography>
        <Box sx={{
          bgcolor: estado === "Dispensado" ? '#D4EDDA' : '#F8D7DA',
          color: estado === "Dispensado" ? '#28A745' : '#C82333',
          px: 2, py: 0.5, borderRadius: 20, fontWeight: 'bold', fontSize: '0.875rem'
        }}>
          {estado}
        </Box>
      </Box>

      {siguiente && (
        <Typography variant="body2" sx={{ mb: 2, color: '#ffc107' }}>
          Próxima dispensa: {formatFecha(siguiente)}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleDispensar}
        startIcon={<LocalGasStationIcon />}
        sx={{ py: 1, textTransform: 'none', borderRadius: 3, bgcolor: '#014d77ff', color: '#fff' }}
      >
        Dispensar Piloto
      </Button>



      <Button
        variant='contained'
        color='error'
        fullWidth
        sx={{ mt: 2, borderRadius: "10px" }}
        onClick={handleDelete}
      >
        ELIMINAR EXPEDIENTE
      </Button>
    </CardContainer>
  );
};

export default PilotCard;
