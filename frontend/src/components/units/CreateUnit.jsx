import React, { useState, useEffect, useContext } from 'react';
import AxiosInstance from '../axios';
import { useNavigate, useLocation } from 'react-router';
import UnitForm from './UnitForm';
import {
  Box, Typography, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress, Checkbox, FormControlLabel
} from '@mui/material';
import { ClassContext } from '../ClassContext';
import { UnitContext } from '../UnitsContext';

const CreateUnit = () => {
  const navigate = useNavigate();
  const { fetchClasses } = useContext(ClassContext);
  const [mode, setMode] = useState(null); // 'new' or 'clone'
  const [existingClasses, setExistingClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [cloneUnits, setCloneUnits] = useState(false);

  const location = useLocation();
  const prefillClassId = location.state?.prefillClassId || '';
  const prefillSchoolYearId = location.state?.prefillSchoolYearId || '';

  const { fetchUnits } = useContext(UnitContext);

  const [initialData, setInitialData] = useState({
    class_id: prefillClassId,
    schoolYearId: prefillSchoolYearId,
  });


  const handleCreateUnit = async (payload) => {
	try {
		const response = await AxiosInstance.post('/unit/', payload);
		console.log('Unit successfully created:', response.data);

		if (cloneUnits && initialData?.units?.length > 0) {
			for (const unit of initialData.units) {
				await AxiosInstance.post('unit/', {
					name: unit.name,
					length: unit.length,
					class_obj: response.data.class_obj
				});
				await fetchUnits();
				// await fetchClasses();
			}
			console.log('Units cloned successfully');
		}
		await fetchUnits();
	} catch (error) {
		console.error('Error creating unit:', error);
	}
  };

  if (!mode) {
	return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Add a Unit</Typography>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => setMode('new')}
        >
          Create New Unit
        </Button>
        {/* <Button
          variant="outlined"
          onClick={() => setMode('clone')}
        >
          Clone Existing Class
        </Button> */}
      </Box>
    );
  }
  
  if (mode === 'clone' && !initialData) {
	return (
		<Box sx={{p:4}}>
			<Typography variant='h5' sx={{mb:2}}>
				Select unit to clone
			</Typography>

			<FormControl fullWidth sx={{mb:2}}>
				<InputLabel id='clone-class-label'>Unit</InputLabel>
				<Select
					labelId='clone-class-label'
					value={selectedClassId}
					onChange={(e) => setSelectedClassId(e.target.value)}
				>
					{existingClasses.map((cls) => (
						<MenuItem key={cls.id} value={cls.id}>
							{cls.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControlLabel 
				control={
					<Checkbox 
						checked={cloneUnits}
						onChange={(e) => setCloneUnits(e.target.checked)}
					/>
				}
				label="Also clone associated units?"
			/>

			{/* Back button */}
			<Box sx={{mt:3, display:'flex', gap:2}}>
				<Button
					variant='outlined'
					onClick={() => setMode(null)}
				>
					Back
				</Button>
				{loading && <CircularProgress size={24} />}
			</Box>

		</Box>
	)
  }

  return (
	<UnitForm 
		initialData={initialData || {}}
		onSubmit={handleCreateUnit}
		buttonLabel='Create'
	/>
  );
};

export default CreateUnit;