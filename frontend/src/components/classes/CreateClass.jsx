import React, { useState, useEffect, useContext } from 'react';
import AxiosInstance from '../axios';
import { useNavigate } from 'react-router';
import ClassForm from './ClassForm';
import {
  Box, Typography, Button, MenuItem, Select, FormControl, InputLabel, CircularProgress, Checkbox, FormControlLabel
} from '@mui/material';
import { ClassContext } from '../ClassContext';

const CreateClass = () => {
  const navigate = useNavigate();
  const { fetchClasses } = useContext(ClassContext);
  const [mode, setMode] = useState(null); // 'new' or 'clone'
  const [existingClasses, setExistingClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [cloneUnits, setCloneUnits] = useState(false); // Checkbox state

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await AxiosInstance.get('class/');
        setExistingClasses(response.data);
      } catch (err) {
        console.error('Failed to fetch existing classes:', err);
      }
    };
    fetchClasses();
  	}, []);

  useEffect( () => {
	const fetchClassData = async () => {
		if (!selectedClassId) return;

		setLoading(true);
		try {
			const response = await AxiosInstance.get(`class/${selectedClassId}/`);
			const classData = response.data;

			const clonedData = {
				name: classData.name + ' (Copy)',
				schoolYearId: '',
			};

			if (cloneUnits && classData.units?.length > 0) {
				clonedData.units = classData.units.map(unit => ({
					name: unit.name,
					description: unit.description,
					duration: unit
				}));
			}

			setInitialData(clonedData);
			setMode('form');
		} catch (error) {
			console.error('Failed to  fetch class data:', error);
		} finally {
			setLoading(false);
		}
	};

	if (mode === 'clone' && selectedClassId){
		fetchClassData();
	}
  }, [selectedClassId,cloneUnits, mode]);

  const handleCreateClass = async (payload) => {
	try {
		const response = await AxiosInstance.post('/class/', payload);
		console.log('Class successfully created:', response.data);

		if (cloneUnits && initialData?.units?.length > 0) {
			for (const unit of initialData.units) {
				await AxiosInstance.post('unit/', {
					...unit,
					class: response.data.id
				});
			}
			console.log('Units cloned successfully');
		}
	} catch (error) {
		console.error('Error creating class:', error);
	}
  };

  if (!mode) {
	return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Add a Class</Typography>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => setMode('new')}
        >
          Create New Class
        </Button>
        <Button
          variant="outlined"
          onClick={() => setMode('clone')}
        >
          Clone Existing Class
        </Button>
      </Box>
    );
  }
  
  if (mode === 'clone' && !initialData) {
	return (
		<Box sx={{p:4}}>
			<Typography variant='h5' sx={{mb:2}}>
				Select class to Clone
			</Typography>

			<FormControl fullWidth sx={{mb:2}}>
				<InputLabel id='clone-class-label'>Class</InputLabel>
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
	<ClassForm 
		initialData={initialData || {}}
		onSubmit={handleCreateClass}
		buttonLabel='Create'
	/>
  );
};

export default CreateClass;