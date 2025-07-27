import React, {useEffect, useState, useContext} from 'react'
import { Typography, Box, List, ListItem, Button, Divider, Link, Grid, Stack, IconButton } from '@mui/material';
import { useNavigate } from 'react-router';
import AxiosInstance from '../axios';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SchoolYearContext } from '../SchoolYearContext';
import { ClassContext } from '../ClassContext';

const SchoolYearHome = () =>{

	const { schoolYears, fetchSchoolYears } = useContext(SchoolYearContext);
	const { classes, fetchClasses } = useContext(ClassContext);
	const navigate = useNavigate();

	useEffect(() => {
		fetchSchoolYears();
		fetchClasses();
	}, []);

	const getClassesForYear = (schoolYearId) => {
		return classes.filter(cls => cls.school_year === schoolYearId);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this school year?')) {
			try {
				await AxiosInstance.delete(`schoolyear/${id}/`);
				setSchoolYears(prev => prev.filter(y => y.id !== id));
			} catch (error) {
				console.error('Failed to delete school year', error);
			}
		}
	};

	if (schoolYears.length === 0) {
		return (
			<Box sx={{p:4}}>
				<Typography variant='h5' gutterBottom>No school years registered yet.</Typography>
				<Link href='/school_year/create' underline='hover'>
					Click here to create your first school year. 				
				</Link>
			</Box>
		)
	}
	console.log("Checking classes", classes)
	return(
		<Box sx={{p:4}}>
			<Typography variant='h3' gutterBottom>School Years</Typography>
			{/* <Typography variant='body1' sx={{pb:3, fontStyle:'italic'}}>Click on the school year to see calendar</Typography> */}
			{/* Header Row */}
			<Grid container spacing={2} sx={{ fontWeight:'bold', mb:2}}>
				<Grid  size={2.5}>School Year</Grid>
				<Grid  size={2.5}>Classes</Grid>
				<Grid  size={2}>Calendar</Grid>
				<Grid  size={2}>Edit</Grid>
				<Grid  size={2}>Delete</Grid>
			</Grid>

			<Divider sx={{mb:2}}/>
			
			{schoolYears.map((year) => (
				<Grid
				container
				spacing={2}
				alignItems='flex-start'
				key={year.id}
				sx={{mb: 2}}
			>
					<Grid  size={2.5}>
						<Typography>{year.schoolyear}</Typography>
					</Grid>

					<Grid  size={2.7}>
						<Stack spacing={0.5}>
						{getClassesForYear(year.id).map(cls => (
							<Typography key={cls.id} variant="body2">{cls.name}</Typography>
						))}
						</Stack>
					</Grid>

					<Grid size={1.8} >
						<IconButton
							size="small"
							onClick={(e) => {
								navigate(`/school_year/${year.id}`);
							}}
						>
							<CalendarMonthIcon fontSize='inherit' />
						</IconButton>
					</Grid>

					<Grid size={2.1}>
						<IconButton
							size="small"
							onClick={(e) => {
								navigate(`/school_year/edit/${year.id}`);
							}}
						>
							<ModeEditIcon fontSize='inherit' />
						</IconButton>
					</Grid>
					<Grid size={2}>
						<IconButton
							size="small"
							onClick={(e) => {
								handleDelete(year);
							}}
						>
							<DeleteIcon fontSize="inherit" />
						</IconButton>
					</Grid>
				</Grid>
			))}

		</Box>
	)
}

export default SchoolYearHome