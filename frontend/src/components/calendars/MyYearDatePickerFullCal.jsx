import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';


const MyYearDatePicker = () => {
	const [selectedDates, setSelectedDates] = useState([]);

	const handleDateClick = (date) => {
		const formattedDate = dayjs(date).format('YYYY-MM-DD');
		setSelectedDates(prev =>
			prev.includes(formattedDate) ? prev.filter(d => d !== formattedDate) : [...prev, formattedDate]
		)
	};

	const eventDates = useMemo(
		() =>
			selectedDates.map((date) => ({
				title:'',
				start:date,
				allDay:true,
				backgroundColor: '#CBC3E3',
				borderColor: '#CBC3E3',
				display: 'background'
			})),
		[selectedDates]
	);

	const today = dayjs();
	const schoolYearStart = today.month() >= 6 ? today.startOf('year').month(6).startOf('month') : today.subtract(1, 'year').month(6).startOf('month')
	const schoolYearEnd = schoolYearStart.add(1, 'year').month(5).endOf('month')

	return (
		<Box sx={{p:3}}>
			<FullCalendar 
				plugins={[multiMonthPlugin]}
				initialView='multiMonthYear'
				initialDate={schoolYearStart.format('YYYY-MM-DD')}
				validRange={{
					start: schoolYearStart.format('YYYY-MM-DD'),
					end: schoolYearEnd.format('YYYY-MM-DD'),
				}}
				headerToolbar={false}
				fixedWeekCount={false}
				height='auto'
				dateClick={handleDateClick}
				events={eventDates}
				dayCellClassNames={(arg) =>
					selectedDates.includes(dayjs(arg.date).format('YYYY-MM-DD')) ? 'selected-day' : ''
				}
			/>
		</Box>
	);
};

export default MyYearDatePicker