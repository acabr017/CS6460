import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";


const MyYearDatePicker = ( { selectedDates, setSelectedDates}) => {
	
	// const handleDateChange = (date) => {
	// 	const formattedDate = dayjs(date).format('YYYY-MM-DD');
	// 	setSelectedDates(prev =>
	// 		prev.includes(formattedDate) ? prev.filter(d => d !== formattedDate) : [...prev, formattedDate]
	// 	)
	// };

	const today = dayjs();
	const startMonth = today.month() >= 6 ? today.startOf('year').month(6) : today.subtract(1,'year').startOf('year').month(6);
	const months = Array.from({length:12}, (_,i) => startMonth.clone().add(i,'month'));
	const schoolYearStart = startMonth.startOf("month").toDate();
  	const schoolYearEnd = startMonth.add(11, "month").endOf("month").toDate();

	const handleSubmit = () => {
		// const outOfServiceDates = selectedDates.map(date => date.format("YYYY-MM-DD"));
		const outOfServiceDates = selectedDates.map(formatDate);
		// console.log("Dates:", outOfServiceDates)
	}

	console.log("In date picker", selectedDates)

	const formatDate = (date) => {
		if (date instanceof Date) return dayjs(date).format("YYYY-MM-DD");
		if (typeof date === "string") return date;
		if (date?.toDate) return dayjs(date.toDate()).format("YYYY-MM-DD");
		return "";
	}

	return (
			<Box sx={{p:3}}>
				<Typography variant='h6'>Select Out-of-Service Days/Holidays</Typography>
				<DatePicker
					multiple
					value={selectedDates.map(d => d.toDate())}
					onChange={setSelectedDates}
					numberOfMonths={3}
					minDate={new Date(2025, 6, 1)}
					maxDate={new Date(2026,5,31)}
					plugins={[<DatePanel />]}
					
    />


				<Box sx={{mt:2}}>
					<Typography variant='subtitle1'> Selected Dates:</Typography>
					{selectedDates.map(date => (
						// <Typography key={date}>{date}</Typography>
						<Typography key={formatDate(date)}>
							{formatDate(date)}
						</Typography>
					))}
				</Box>
				{/* <Button variant='contained' sx={{mt:2}} onClick={() => console.log(selectedDates)}> */}
				{/* <Button variant='contained' sx={{mt:2}} onClick={handleSubmit}>
					Save Dates
				</Button> */}
				
			</Box>
	);
};

export default MyYearDatePicker