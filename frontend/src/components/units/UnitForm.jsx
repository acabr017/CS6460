import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  Alert,
  Typography
} from '@mui/material';
import MyButton from '../forms/MyButton';
import AxiosInstance from '../axios';
import { useNavigate} from 'react-router'
import { useContext } from 'react';
import { ClassContext } from '../ClassContext';
import { SchoolYearContext } from '../SchoolYearContext';


const UnitForm = ({
	initialData = {},
	onSubmit,
	buttonLabel = 'Create'
}) => {


// consts for Start and End Dates
const navigate = useNavigate();
const [name, setName] = useState(initialData.name || '');
const [length, setLength] = useState(initialData.length || '');
const [classId, setClassId] = useState(initialData.class_id || '');
const [showSuccess, setShowSuccess] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const { classes } = useContext(ClassContext);
const { schoolYears } = useContext(SchoolYearContext);

const getSchoolYearLabel = (schoolYearId) => {
	if (!schoolYearId) return "None";
	const year = schoolYears.find((y) => y.id === schoolYearId)
	return year ? year.schoolyear : "None";
}


const handleSubmit = async (event) => {
	event.preventDefault();

	if (!name.trim()) {
		setErrorMessage('Unit name is required.');
		return;
	}
	if (!classId) {
		setErrorMessage('You must select a class to attach this unit to.');
		return;
	}

	const payload = {
		name,
		length,
		class_obj: classId
		
	};
	console.log('Unit Payload:', payload);


	try {
		await onSubmit(payload);
		// await fetchClasses();
		setShowSuccess(true);
		setTimeout(() => {
			setShowSuccess(false);
			navigate('/');
		}, 2000);
	} catch (error) {
		console.error('Error passed back from parent onSubmit:', error);
		setErrorMessage(error.response?.data?.detail || 'An error occurred. Please try again.');
	}
};



return(
	<>
	<Collapse in={showSuccess}>
		<Alert severity="success" sx={{ mb: 2 }}>
			Unit successfully {buttonLabel === 'Create' ? 'created!' : 'updated!'}
		</Alert>
	</Collapse>

	<Collapse in={!!errorMessage}>
		<Alert severity="warning" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
			{errorMessage}
		</Alert>
	</Collapse>

	<form onSubmit={handleSubmit}>
		<Box sx={{ p: 4 }}>

			{/* title */}
			<Box component="header" sx={{ mb: 3}}>
				<Typography variant="h4">{buttonLabel} Unit</Typography>
			</Box>

			{/* Explanation text */}
			<Box sx={{ mb: 2, pb: 1 }}>
				To {buttonLabel.toLowerCase()} a unit, please fill out the form below. All fields marked 
				<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic', pl:0.5 }}>
					*
				</Typography> are mandatory.
			</Box>

				{/* Class Name */}
			<Box sx={{py: 2}}>
				{/* <Typography> */}
					<Typography fontSize={20}>
						Unit Name
						<sup>
							<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic',  }}>
								*
							</Typography>
						</sup>
					</Typography>
					<Typography variant="body2" sx={{ fontStyle: 'italic' }}>
						It is recommended that unit names are descriptive.
					</Typography>	
				{/* </Typography> */}


			</Box>
			<Box sx={{ mb: 2 }}>
				<TextField
				label="ex. Unit 1 - Kinematics"
				fullWidth
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				/>
			</Box>

			<Box sx={{py: 2}}>
				{/* <Typography> */}
					<Typography fontSize={20}>
						Unit Duration
						<sup>
							<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic',  }}>
								*
							</Typography>
						</sup>
					</Typography>
					<Typography variant="body2" sx={{ fontStyle: 'italic' }}>
						How many class periods will this unit last?
					</Typography>	
				{/* </Typography> */}


			</Box>

			<Box sx={{ mb: 2 }}>
				<TextField
				label="Length (in days) - ex: 7"
				type="number"
				fullWidth
				value={length}
				onChange={(e) => setLength(parseInt(e.target.value))}
				required
				margin="normal"
			/>
			</Box>

			<Box sx={{py: 2}}>
				{/* <Typography> */}
					<Typography fontSize={20}>
						Attach to Class
						<sup>
							<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic',  }}>
								*
							</Typography>
						</sup>
					</Typography>
					<Typography variant="body2" sx={{ fontStyle: 'italic' }}>
						Select the class this unit belongs to.
					</Typography>	
			</Box>
			
			<Box>
				<FormControl fullWidth margin='normal' required>
					<InputLabel id='class-select-label'>Class</InputLabel>
					<Select
						labelId='class-select-label'
						value={classId}
						onChange={(e) => setClassId(e.target.value)}
						label='Class'
						disabled={!!initialData.class_id}
					>
						{classes.map((cls) => (
							<MenuItem key={cls.id} value={cls.id}>
								{cls.name} ({getSchoolYearLabel(cls.school_year)})
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			

			

			

			{/* Submit Button */}
			<Box sx={{display: 'flex', justifyContent: 'left', mt:4, pl: 53}}>
				<MyButton 
				label={buttonLabel}
				type={'submit'}
				sx={{
					width: '100px',
					padding: '6px',
				}}/>
			</Box>

		</Box>
	</form>

	</>
);
}


export default UnitForm