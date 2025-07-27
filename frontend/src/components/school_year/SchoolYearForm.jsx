import React, { useState, useEffect} from 'react';
import { Alert, Collapse, Box, Typography} from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import MyButton from '../forms/MyButton'
import Term from './Term';
import OutOfServiceDates from './OutOfServiceDates';
import SchoolYearDates from './SchoolYearDates';


const SchoolYearForm = ({
	initialData = {},
	onSubmit,
	buttonLabel = 'Create'
}) => {


	// consts for Start and End Dates
	const [startDate, setStartDate] = useState(initialData.startDate || null);
	const [endDate, setEndDate] = useState(initialData.endDate ||null);
	const [startDateError, setStartDateError] = useState('');
	const [endDateError, setEndDateError] = useState('');
	const [showSuccess, setShowSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	
	// consts for allowing users to define terms
	const [customTerms, setCustomTerms] = useState(initialData.customTerms ||false);
	const [openTerms, setOpenTerms] = useState(initialData.openTerms || true);
	const [termCount, setTermCount] = useState(initialData.termCount || 2);
	const [termDates, setTermDates] = useState(initialData.termDates || []);
	const [termErrors, setTermErrors] = useState(
		Array.from({length: termCount || 0}, () => ({start: '', end: ''}))
	)

	// consts for out-of-service/holdays
	const [defineHolidays, setDefineHolidays] = useState(initialData.defineHolidays ||false);
	const [openHolidays, setOpenHolidays] = useState(initialData.openHolidays || true);
	const [outOfServiceDates, setOutOfServiceDates] = useState(initialData.outOfServiceDays ||[])

	// consts for including weekends
	const [includeWeekends, setIncludeWeekends] = useState(initialData.includeWeekends ||false);



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
		if (checked) {
			const defaultCount = 1;
			setTermCount(defaultCount);
			setTermDates(Array.from({ length: defaultCount }, (_, i) => ({
				name: `Term ${i + 1}`,
				start: null,
				end: null
		})));
			setTermErrors(Array.from({ length: defaultCount }, () => ({ start: '', end: '' })));
		} else {
			setTermCount('');
			setTermDates([]);
		}
	};

	const handleToggleDefineHolidays = (checked) => {
		setDefineHolidays(checked);
		if (!checked) {setOutOfServiceDates([])}
	}

	const validateDatesInline = (start, end) => {
		let hasError = false;

		if (!start) {
			setStartDateError("School Year Start Date is required. ");
			hasError = true;
		} else {
			setStartDateError("");
		}

		if (!end) {
			setEndDateError("School Year End Date is required.");
			hasError = true;
		} else if (start && end.isBefore(start)) {
			setEndDateError("End Date must be after Start Date.")
			hasError = true;
		} 
		
		else {
			setEndDateError("");
		}

		return hasError;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		const hasDateError = validateDatesInline(startDate, endDate);

		if (hasDateError) {
			alert("Please fix the highlighted fields.")
			return;
		}
		
		const payload = {
			schoolyear: `${startDate.year()}-${endDate.year()}`,
			start_date: startDate ? startDate.format('YYYY-MM-DD') : null,
			end_date: endDate ? endDate.format('YYYY-MM-DD') : null,
			weekends: includeWeekends,
			out_of_service_days: defineHolidays ? outOfServiceDates.map(date => ({ date: dayjs(date).format("YYYY-MM-DD") })) : [],
			terms: customTerms && termDates.length > 0 ? termDates.map(term => ({
				name: term.name,
				start_date: term.start ? term.start.format('YYYY-MM-DD') : null,
				end_date: term.end ? term.end.format('YYYY-MM-DD') : null,
			})) : [],

		};

		console.log('Payload:', payload)
		

		try {

			await onSubmit(payload);
			setShowSuccess(true);
			setTimeout(() => setShowSuccess(false), 2000);
		} catch (error) {
		console.error("Error passed back from parent onSubmit:", error);
		// Optionally show a generic message
		setErrorMessage(error.message || "An error occurred. Please try again.");
		}
	}

	// useEffect( () => {
	// 	if (initialData) {
	// 		setStartDate(initialData.startDate || null);
	// 		setEndDate(initialData.endDate || null);
	// 		setIncludeWeekends(initialData.includeWeekends || false);
	// 		setDefineHolidays(initialData.outOfServiceDates?.length > 0);
	// 		setOutOfServiceDates(initialData.outOfServiceDates || []);
	// 		setCustomTerms(initialData.termDates?.length > 0);
	// 		setTermCount(initialData.termDates?.length || 2);
	// 		setTermDates(initialData.termDates || []);
	// 	}
	// 	}, [initialData]);

	console.log("In SchoolYearForm.jsx", outOfServiceDates)
	return(
		<>
		<Collapse in={showSuccess}>
			<Alert severity="success" sx={{ mb: 2 }}>
				School year successfully {buttonLabel === 'Create' ? 'created!' : 'updated!'}
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
					<Typography variant="h4">{buttonLabel} the School Year</Typography>
				</Box>

				{/* Explanation text */}
				<Box sx={{ mb: 3, pb: 4 }}>
					To {buttonLabel.toLowerCase()} a school year, please fill out the form below. All fields marked 
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


export default SchoolYearForm