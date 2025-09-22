import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

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

const PilotCard = ({nombre,idPiloto,ultimaDispensa,diasRestantes,dispensas = [],onUpdateDispensas = () => {},}) => {

  // Estado calculado a partir de diasRestantes
  const isPendiente = diasRestantes > 0; // true = no puede dispensar
  const estadoTexto = isPendiente ? "Dispensado" : "Pendiente";


  return (
    <CardContainer>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: '#E0F2FF', color: '#1976D2' }}>
          <PersonOutlinedIcon />
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID de Piloto: {idPiloto}
          </Typography>
        </Box>
      </Box>

      {/* Última dispensa */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body1" color="#607d8b">
          Última Dispensa
        </Typography>
        <Typography variant="body1" fontWeight="bold">
         
        </Typography>
      </Box>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'grey.400', mb: 2 }} />

      {/* Estado actual */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="body1" color="#607d8b">
          Estado Actual
        </Typography>
        <Box
          sx={{
            bgcolor: isPendiente ? '#D4EDDA' : '#F8D7DA',
            color: isPendiente ? '#28A745' : '#C82333',
            px: 2,
            py: 0.5,
            borderRadius: 20,
            fontWeight: 'bold',
            fontSize: '0.875rem',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          {estadoTexto}
        </Box>
      </Box>

      {/* Botón */}
      <Button
        variant="contained"
        fullWidth
        disabled={isPendiente}
        startIcon={isPendiente ? <LockOutlinedIcon /> : <LocalGasStationIcon />}
        sx={{
          py: 1,
          textTransform: 'none',
          borderRadius: 3,
          bgcolor: isPendiente ? '#607d8b' : '#014d77ff',
          color: '#fff',
          '&:hover': {
            bgcolor: isPendiente ? '#546e7a' : '#00365dff',
          },
        }}
    
      >
        {isPendiente ? "Bloqueado" : "Dispensar Piloto"}
      </Button>

      {/* Nota cuando está bloqueado */}
      {isPendiente && (
        <Typography variant="body2" sx={{ mt: 2, color: '#ffc107' }}>
          Debe esperar {diasRestantes} días para dispensar nuevamente.
        </Typography>
      )}
    </CardContainer>
  );
};

export default PilotCard;
