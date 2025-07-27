import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const MyMultiDateSelector = () => {
	const [selectedDates, setSelectedDates] = useState([]);

	const handleDateChange = (date) => {
		const formattedDate = dayjs(date).format('YYYY-MM-DD');
		setSelectedDates(prev =>
			prev.includes(formattedDate) ? prev.filter(d => d !== formattedDate) : [...prev, formattedDate]
		)
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box sx={{p:3}}>
				<Typography variant='h6'>Select Out-of-Service Days/Holidays</Typography>
				<DateCalendar 
					onChange={handleDateChange}
					views={['year','day']}
					renderDay={(day, _ignored, pickersDayProps) => {
						const formattedDay = dayjs(day).format('YYYY-MM-DD')
						const isSelected = selectedDates.includes(formattedDay);

						return (
							<div
								{...pickersDayProps}
								style={{
									backgroundColor: isSelected ? '#CBC3E3' : '',
									color: isSelected ? 'white' :'',
									borderRadius: '50%',
									cursor: 'pointer',
								}}
								onClick={() => handleDateChange(day)}
							>
								{day.date()}
							</div>
						);
					}}
				/>
				<Box sx={{mt:2}}>
					<Typography variant='subtitle1'> Selected Dates:</Typography>
					{selectedDates.map(date => (
						<Typography key={date}>{date}</Typography>
					))}
				</Box>
				<Button variant='contained' sx={{mt:2}} onClick={() => console.log(selectedDates)}>
					Save Dates
				</Button>
				
			</Box>
		</LocalizationProvider>
	);
};

export default MyMultiDateSelector