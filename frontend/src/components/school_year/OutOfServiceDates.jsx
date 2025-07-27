import React from 'react';
import {
  Box, Typography, FormControlLabel, Checkbox,
  IconButton, Divider, Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import MyYearDatePicker from '../calendars/MyYearDatePicker';


const OutOfServiceDates = ({
	defineHolidays,
	onToggleDefineHolidays,
	openHolidays,
	setOpenHolidays,
	selectedDates,
	setSelectedDates
}) => {
	console.log("In OutofServiceDates.jsx", selectedDates)
	return (
		<Box sx={{pl: 3, pt: 4}}>
					<FormControlLabel
						control={
							<Checkbox 
								checked={defineHolidays}
								onChange={(e) => {
									onToggleDefineHolidays(e.target.checked);
								}}
							/>
						}
						labelPlacement='start'
						label={<Typography variant="h6" sx={{ mr: 4}}>Define out-of-service dates/holidays?</Typography>}
					/>

					{defineHolidays && (
						<Box sx={{
							border: '1px solid #ccc',
							borderRadius: 2,
							mt: 2,
							overflow: 'hidden',
						}}>
							<Box sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								bgcolor: '#f5f5f5',
								px: 2,
								py: 1,
							}}>
								<Typography variant='h6' sx={{pl:4}}>Select Out-of-Service Dates/Holidays</Typography>
								<IconButton onClick={() => setOpenHolidays(!openHolidays)} size="small">
									{openHolidays ? <ExpandLess /> : <ExpandMore />}
								</IconButton>
							</Box>

							<Divider />

							<Collapse in={openHolidays}>
								<Box sx={{ p: 2}}>
									<MyYearDatePicker
										selectedDates={selectedDates}
										setSelectedDates={setSelectedDates}
									/>
								</Box>

							
							</Collapse>
						</Box>
					)}


				</Box>
	)
}

export default OutOfServiceDates