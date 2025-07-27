import React, { useState, useContext } from 'react';
import { Box, Typography, MenuItem, FormControl, Select, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import { ClassContext } from '../ClassContext';
import { UnitContext } from '../UnitsContext';

const UnitHome = () => {
  const { classes } = useContext(ClassContext);
  const { units } = useContext(UnitContext);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedClassId(event.target.value);
  };

  const selectedUnits = units.filter(unit => unit.class_obj === selectedClassId);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>All Units for Selected Class</Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Select value={selectedClassId} onChange={handleChange} displayEmpty>
          <MenuItem value="" disabled>Select a class</MenuItem>
          {classes.map(cls => (
            <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedClassId && selectedUnits.length === 0 ? (
        <Box>
          <Typography variant="body1">No registered units.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() =>
				navigate('/unit/create', {
				state: {
					prefillClassId: selectedClassId,
					// prefillSchoolYearId: classData.school_year,
				},
				})
			}>
            Create a Unit
          </Button>
        </Box>
      ) : (
        <List>
          {selectedUnits.map(unit => (
            <React.Fragment key={unit.id}>
              <ListItem>
                <ListItemText
                  primary={unit.name}
                  secondary={unit.start_date ? `Placed on: ${unit.start_date}` : 'Not placed on calendar'}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UnitHome;