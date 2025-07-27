import React, { useState } from 'react';
import { Alert, Collapse, Box, Typography, TextField} from '@mui/material';
import { Checkbox, FormControlLabel, FormControl, MenuItem, Select, IconButton, InputLabel, Divider } from '@mui/material';
import dayjs from 'dayjs';
import MyButton from '../forms/MyButton'
import AxiosInstance from '../axios'
import {useNavigate} from 'react-router'
import Term from './Term';
import OutOfServiceDates from './OutOfServiceDates';
import SchoolYearDates from './SchoolYearDates';
import { useContext } from 'react';
import { SchoolYearContext } from '../SchoolYearContext';
import { School } from '@mui/icons-material';

const CreateSchoolYear = () => {

	const navigate = useNavigate();
	const { fetchSchoolYears } = useContext(SchoolYearContext);

	// consts for Start and End Dates
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [startDateError, setStartDateError] = useState('');
	const [endDateError, setEndDateError] = useState('');
	const [showSuccess, setShowSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	
	// consts for allowing users to define terms
	const [customTerms, setCustomTerms] = useState(false);
	const [openTerms, setOpenTerms] = useState(true);
	const [termCount, setTermCount] = useState(2);
	const [termDates, setTermDates] = useState([]);
	const [termErrors, setTermErrors] = useState(
		Array.from({length: termCount || 0}, () => ({start: '', end: ''}))
	)

	// consts for out-of-service/holdays
	const [defineHolidays, setDefineHolidays] = useState(false);
	const [openHolidays, setOpenHolidays] = useState(true);
	const [outOfServiceDates, setOutOfServiceDates] = useState([])

	// consts for including weekends
	const [includeWeekends, setIncludeWeekends] = useState(false);



	const validateDates = (start, end) => {
		if (start && end && end.isBefore(start)) {
			setEndDateError('End date must be after start date');
			} else {
				setEndDateError('');
			}
	};

	const validateTermDates = (updatedDates) => {
		const errors = updatedDates.map((term, index) => {
			let startError = '';
			let endError = '';
			
			if (term.start && term.end && dayjs(term.end).isBefore(term.start)) {
				endError = 'End of term must be after start of term.';
			}

			if (index > 0 && term.start && updatedDates[index -1].end) {
				if (dayjs(term.start).isBefore(updatedDates[index-1].end)){
					startError = 'New term must start after previous term ends.'
				}
			}

			if ( term.start && startDate && dayjs(term.start).isBefore(startDate)) {
				startError = 'Term start date must be on or after school year start date'
			}

			if (term.end && endDate && dayjs(term.end).isAfter(endDate)) {
				endError = 'Term end date must be on or before school year end date.'
			}
			return {start: startError, end: endError}
		});
		setTermErrors(errors)
	}

	const handleTermDateChange = (index, field, value) => {
		const updated = termDates.map((term, i) =>
			i === index ? { ...term, [field]:value} : term
		);
		setTermDates(updated);
		validateTermDates(updated);

	}

	const handleTermCountChange = (count) => {
		setTermCount(count);

		setTermDates(Array.from({ length: count}, (_, i) => ({
			name: `Term ${i+1}`,
			start: null,
			end: null
		})));

		setTermErrors(Array.from({ length: count }, () => ({ start: '', end: '' })));
	}

	const handleStartDateChange = (date) => {
		setStartDate(date);
		validateDates(date, endDate);
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
		validateDates(startDate, date);
	};

	const handleToggleCustomTerms = (checked) => {
		setCustomTerms(checked);
		setTermCount('');
		setTermDates([]);
	};

	const handleToggleDefineHolidays = (checked) => {
		setDefineHolidays(checked);
		if (!checked) {
			setOutOfServiceDates([])
		}
	}


	const handleSubmit = async (event) => {
		event.preventDefault();

		setErrorMessage('');

		let hasError = false;
		
		if (!startDate) {
			setStartDateError('School Yeart Start Date is required');
			hasError = true;
		}
		if (!endDate) {
			setEndDateError('School Yeart End Date is required');
			hasError = true;
		// } else if (endDateError || !startDate || !endDate) {
		// 	alert('Please fix date errors before submitting.');
		// 	return;
		} 

		if (hasError) {
			alert("Please fix the highlighted fields.");
			return;
		}
		
		const payload = {
			schoolyear: `${startDate.year()}-${endDate.year()}`,
			start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
			end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
			weekends: includeWeekends,
			out_of_service_dates: defineHolidays ? outOfServiceDates.map(date => dayjs(date).format("YYYY-MM-DD")) : [],
			terms: customTerms ? termDates.map(term => ({
				name: term.name,
				start: term.start ? term.start.format('YYYY-MM-DD') : null,
				end: term.end ? term.end.format('YYYY-MM-DD') : null,
			})) : [],

		};

		console.log('Payload:', payload)

		try {
			const response = await AxiosInstance.post("schoolyear/", payload);
			fetchSchoolYears();
			console.log("Response:", response);
			if (response.status === 201 || response.status === 200) {
				// console.log("Success:", response.data);
				setShowSuccess(true);
				setTimeout(() => {
					setShowSuccess(false);
					navigate('/');
				}, 2000);
				}
			
		} catch (error) {
			console.error("Backend error:", error.response?.data);
			console.error("Status:", error.response?.status);
			console.error("Payload sent:", payload);

			if (error.response && error.response.data) {
				const status = error.response.status;
				const backendError = error.response.data;
				console.log("Error data:", backendError);
				console.log("Error Status:", status);

				let message = '';

				if (typeof backendError === 'string') {
					message = backendError;
				} else if (backendError.detail) {
					message = backendError.detail;
				} else if (backendError.non_field_errors?.[0]) {
					message = backendError.non_field_errors[0];
				} else {
					const firstKey = Object.keys(backendError)[0];
					if (firstKey && Array.isArray(backendError[firstKey])) {
						message = `${firstKey}: ${backendError[firstKey][0]}`;
					} else {
						message = "An unknown error occurred.";
					}
				}
				setErrorMessage(message);	
			} else {
				setErrorMessage("An error occurred. Please try again.")
			}
		}
	}


	return(
		<>
		<Collapse in={showSuccess}>
			<Alert severity="success" sx={{ mb: 2 }}>
				School year successfully created!
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
					<Typography variant="h4">Create the School Year</Typography>
				</Box>

				{/* Explanation text */}
				<Box sx={{ mb: 3, pb: 4 }}>
					To create a school year, please fill out the form below. All fields marked 
					<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic', pl:0.5 }}>
						*
					</Typography> are mandatory.
				</Box>

				{/* Define Start and End of School Year */}
				<SchoolYearDates
					startDate={startDate}
					endDate={endDate}
					onStartDateChange={handleStartDateChange}
					onEndDateChange={handleEndDateChange}
					startDateError={startDateError}
					endDateError={endDateError}
				/>


				{/* Define Terms?[Semester,Quarters, trimesters?] */}
				<Term 
					customTerms={customTerms}
					setCustomTerms={setCustomTerms}
					openTerms={openTerms}
					setOpenTerms={setOpenTerms}
					termCount={termCount}
					handleTermCountChange={handleTermCountChange}
					termDates={termDates}
					handleTermDateChange={handleTermDateChange}
					termErrors={termErrors}
					onToggleCustomTerms={handleToggleCustomTerms}

				/>

				{/* Define out-of-service dates/holidays */}
				<OutOfServiceDates
					defineHolidays={defineHolidays}
					onToggleDefineHolidays={handleToggleDefineHolidays}
					openHolidays={openHolidays}
					setOpenHolidays={setOpenHolidays}
					selectedDates={outOfServiceDates}
					setSelectedDates={setOutOfServiceDates}
				/>
				

				{/* Include weekends? */}

				<Box sx={{pl: 3, pt: 4}}>
					<FormControlLabel
						control={
							<Checkbox 
								checked={includeWeekends}
								onChange={(e) => {
									setIncludeWeekends(e.target.checked);
								}}
							/>
						}
						labelPlacement='start'
						label={<Typography variant="h6" sx={{ mr: 4}}>Include weekends in calendar? [off by default]</Typography>}
					/>

				</Box>
				

				{/* Submit Button */}
				<Box sx={{display: 'flex', justifyContent: 'left', mt:4, pl: 53}}>
					<MyButton 
					label={"Create"}
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


export default CreateSchoolYear