import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Button } from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { getData,saveData } from '../utils/storage';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const handleDispensar = async () => {
    const ahora = new Date();

    if (siguiente && ahora < new Date(siguiente)) {
      Swal.fire({
        icon: 'info',
        title: 'Aún no le toca',
        text: `La próxima dispensa es el ${formatFecha(siguiente)}`,
      });
      return;
    }

  const { value: formValues } = await Swal.fire({
    title: 'Registrar dispensa',
   html: `
    <div style="font-family: sans-serif;">
      <input id="cantidad" type="number" min="1" placeholder="Cantidad en galones" class="swal2-input" />
      <label style="display:flex; align-items:center; gap:8px; justify-content:center;">
        <input id="turnoDoble" type="checkbox" /> Turno doble
      </label>
      <textarea id="nota" class="swal2-textarea" placeholder="Agregar nota (opcional)"></textarea>
    </div>
  `,

    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    customClass: {
    title: 'swal-title', // aplicamos una clase al título
  },
    preConfirm: () => {
      const cantidad = document.getElementById('cantidad').value;
      const turnoDoble = document.getElementById('turnoDoble').checked;
      const nota = document.getElementById('nota').value;

      if (!cantidad || cantidad <= 0) {
        Swal.showValidationMessage('Debe ingresar una cantidad válida');
        return false;
      }

      return { cantidad: parseInt(cantidad, 10), turnoDoble, nota };
    }
  });

  const { cantidad, turnoDoble, nota } = formValues;

    if (!cantidad) return; // Cancelado o inválido

    const nuevaFechaSiguiente = new Date();
    nuevaFechaSiguiente.setDate(nuevaFechaSiguiente.getDate() + (turnoDoble ? 5 : 6));
    // Actualizar storage
    const expedientes = getData("expedientes") || [];
    const actualizado = expedientes.map(exp => {
      if (exp.id === id) {
        const nuevaDispensa = {
          fecha: ahora.toISOString(),
          unidad,
          cantidad: parseInt(cantidad, 10), 
          nota,
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
    saveData("expedientes", actualizado);
    setEstado("Dispensado");
    setSiguiente(nuevaFechaSiguiente.toISOString());
    Swal.fire({
      icon: 'success',
      title: 'Dispensado',
      text: `Se registraron ${cantidad} galones. Próxima dispensa: ${formatFecha(nuevaFechaSiguiente)}`,
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
          px: 2, py: 0.5, borderRadius: 20, fontWeight: 'bold', fontSize: '0.875rem',fontFamily:'sans-serif'
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
        startIcon={<DeleteIcon/>}
        sx={{ mt: 2, borderRadius: "10px" }}
        onClick={handleDelete}
      >
        ELIMINAR EXPEDIENTE
      </Button>
    </CardContainer>
  );
};

export default PilotCard;
