import React from 'react';
import {
  Box, Typography, FormControlLabel, Checkbox, IconButton,
  Divider, FormControl, MenuItem, Select, Collapse, TextField
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const Term = ({
	customTerms,
	setCustomTerms,
	openTerms,
	setOpenTerms,
	termCount,
	setTermCount,
	termDates,
	setTermDates,
	termErrors,
	setTermErrors,
	startDate,
	endDate,
	validateTermDates,
	handleTermDateChange,
	onToggleCustomTerms,
	handleTermCountChange
}) => {

	return (

		<Box sx={{pl: 3, pt: 4}}>

			<FormControlLabel
				control={
					<Checkbox 
						checked={customTerms}
						onChange={(e) => {
							onToggleCustomTerms(e.target.checked);
						}}
					/>
				}
				labelPlacement='start'
				label={<Typography variant="h6" sx={{ mr: 4}}>Define start/end of term dates?</Typography>}
				/>

				{customTerms && (
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
							<Typography variant='h6' sx={{pl:4}}>Term Settings</Typography>
							<IconButton onClick={() => setOpenTerms(!openTerms)} size="small">
								{openTerms ? <ExpandLess /> : <ExpandMore />}
							</IconButton>
						</Box>

						<Divider />

						<Collapse in={openTerms}>
							<Box sx={{ p: 2}}>
								<Box sx={{ my:2, pl:  4, display: 'flex', alignItems: 'center'}}>
									<Typography variant='h6'>How many terms?</Typography>
									<FormControl size="small">
										<Select
											value={termCount}
											onChange={(e) => {
												const count = parseInt(e.target.value);
												handleTermCountChange(count);
												// setTermCount(count);
												// setTermDates(Array.from({ length: count }, () => ({ start: null, end: null })));
												// setTermErrors(Array.from({ length: count }, () => ({ start: '', end: '' })));
											}}
											sx={{ml:3}}
										>
											{[2, 3, 4].map(num => (
													<MenuItem key={num} value={num}>
														{num}
													</MenuItem>
													)
												)
											}
										</Select>
									</FormControl>
								</Box>
							</Box>

							{
					customTerms && termCount > 0 && (
						<Box sx={{pl: 5}}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
							{
								termDates.map((term,index) => (
									<Box key={index} sx={{display:'flex', gap: 2, alignItems: 'center', my: 2}}>
										<TextField
											label={`Name for Term ${index + 1}`}
											value={term.name}
											onChange={(e) =>
											handleTermDateChange(index, 'name', e.target.value)
											}
											size="small"
											sx={{ width: 200 }}
										/>
										<DatePicker 
											label="Start Date"
											value={term.start}
											onChange={(date) => handleTermDateChange(index, 'start', date)}
											slotProps={{
												textField: {
													error: !!termErrors[index]?.start,
													helperText: termErrors[index]?.start || '',
												}
											}}
										/>
										<DatePicker 
											label="End Date"
											value={term.end}
											onChange={(date) => handleTermDateChange(index, 'end', date)}
											slotProps={{
												textField: {
													error: !!termErrors[index]?.end,
													helperText: termErrors[index]?.end || '',
												}
											}}
										/>
									</Box>
									)
								)
							}
							</LocalizationProvider>
						</Box>
					)
				}
						</Collapse>
					</Box>
				)}
		</Box>
	)}

	export default Term;