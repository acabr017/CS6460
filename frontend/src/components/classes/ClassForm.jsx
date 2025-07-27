import React, { useState, useEffect } from 'react';
import {
  Alert, Collapse, Box, Typography, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import MyButton from '../forms/MyButton';
import AxiosInstance from '../axios';
import { useNavigate} from 'react-router'
import { useContext } from 'react';
import { ClassContext } from '../ClassContext';


const ClassForm = ({
	initialData = {},
	onSubmit,
	buttonLabel = 'Create'
}) => {


// consts for Start and End Dates
const navigate = useNavigate();
const [name, setName] = useState(initialData.name || '');
const [schoolYearId, setSchoolYearId] = useState(initialData.schoolYearId || '');
const [showSuccess, setShowSuccess] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [schoolYears, setSchoolYears] = useState([]);
const [existingClasses, setExistingClasses] = useState([]);
const { classes, fetchClasses } = useContext(ClassContext);

const selectedSchoolYear = schoolYears.find((schoolYear) => schoolYear.id === schoolYearId);

	useEffect(() => {
	const fetchData = async () => {
	try {
			const [schoolYearResponse, classResponse] = await Promise.all([
			AxiosInstance.get('schoolyear/'),
			AxiosInstance.get('class/')
			]);
			setSchoolYears(schoolYearResponse.data);
			setExistingClasses(classResponse.data);
		} catch (err) {
			console.error('Failed to fetch school years or classes:', err);
		}
		};
		fetchData();
	}, []);


const handleSubmit = async (event) => {
	event.preventDefault();

	if (!name.trim()) {
		setErrorMessage('Class name is required.');
		return;
	}
	// if (!schoolYearId) {
	// 	setErrorMessage('You must select a school year.');
	// 	return;
	// }

	const payload = {
		name,
		...(schoolYearId && {school_year: schoolYearId}),
	};

	console.log('Class Payload:', payload);

	try {
		await onSubmit(payload);
		await fetchClasses();
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

useEffect(() => {
	if (initialData && Object.keys(initialData).length > 0) {
		setName(initialData.name || '');
		setSchoolYearId(initialData.schoolYearId || '');
	}
}, [initialData]);


return(
	<>
	<Collapse in={showSuccess}>
		<Alert severity="success" sx={{ mb: 2 }}>
			Class successfully {buttonLabel === 'Create' ? 'created!' : 'updated!'}
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
				<Typography variant="h4">{buttonLabel} Class</Typography>
			</Box>

			{/* Explanation text */}
			<Box sx={{ mb: 2, pb: 1 }}>
				To {buttonLabel.toLowerCase()} a class, please fill out the form below. All fields marked 
				<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic', pl:0.5 }}>
					*
				</Typography> are mandatory.
			</Box>

				{/* Class Name */}
			<Box sx={{py: 2}}>
				{/* <Typography> */}
					<Typography fontSize={20}>
						Class Name
						<sup>
							<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic',  }}>
								*
							</Typography>
						</sup>
					</Typography>
					<Typography variant="body2" sx={{ fontStyle: 'italic' }}>
						It is recommended that class names are unique to best distinguish them.
					</Typography>	
				{/* </Typography> */}


			</Box>
			<Box sx={{ mb: 2 }}>
				<TextField
				label="ex. Honours Physics"
				fullWidth
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				/>
			</Box>

			<Box sx={{py: 2}}>
				<Typography fontSize={20}>Attach class to a school year?</Typography>	
			</Box>
			
			<Box sx={{ mb: 3 }}>
				<FormControl fullWidth>
				<InputLabel id="school-year-label"></InputLabel>
				<Select
					labelId="school-year-label"
					value={schoolYearId || ''}
					onChange={(e) => setSchoolYearId(Number(e.target.value))}
					
				>
					<MenuItem value="">
					<em>None</em>
					</MenuItem>
					{schoolYears.map((schoolYear) => (
					<MenuItem key={schoolYear.id} value={schoolYear.id}>
						{schoolYear.schoolyear} ({schoolYear.start_date} to {schoolYear.end_date})
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


export default ClassForm