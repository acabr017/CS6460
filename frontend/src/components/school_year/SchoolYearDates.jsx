import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const SchoolYearDates = ({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	startDateError,
	endDateError
}) => {
	return (
		<Box>
			{/* Start Date */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 5, pl: 5 }}>
				<Typography variant="h6" sx={{ mr: 3}}>
					School Year Start Date
					<sup>
						<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic',  }}>
							*
						</Typography>
					</sup>
					:
				</Typography>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker 
						label="Start Date"
						value={startDate}
						onChange={onStartDateChange}
						slotProps={{ 
							textField: {
								variant: 'outlined',
								error: !!startDateError,
								helperText: startDateError,
							}
						
						}}
					/>
				</LocalizationProvider>
			</Box>

			{/* End Date */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pl: 5 }}>
				<Typography variant="h6" sx={{ mr: 4}}>School Year End Date
					<sup>
						<Typography component="span" sx={{ fontSize: '0.8rem', color: 'red', fontStyle: 'italic' }}>
							*
						</Typography>
					</sup>
					:
					</Typography>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker 
						label="End Date" 
						value={endDate}
						onChange={onEndDateChange}
						slotProps={{
							textField: {
							error: !!endDateError,
							helperText: endDateError,
							},
						}}
					/>
				</LocalizationProvider>
			</Box>
		</Box>
	)
}

export default SchoolYearDates