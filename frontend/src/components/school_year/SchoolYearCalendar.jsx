import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import AxiosInstance from '../axios';
import MyCalendar1 from '../calendars/myCalendar1'
import { Draggable } from '@fullcalendar/interaction';
import { SchoolYearContext } from '../SchoolYearContext';
import dayjs from 'dayjs';
import { UnitContext } from '../UnitsContext';
import { ClassContext } from '../ClassContext';
import { useSelectedClass } from '../SelectedClassContext';

// function addWeekdays(startDate, daysToAdd) {
//   const result = new Date(startDate);
//   let added = 0;

//   while (added < daysToAdd) {
//     result.setDate(result.getDate() + 1);
//     const day = result.getDay();
//     if (day !== 0 && day !== 6) {
//       added++;
//     }
//   }

//   return result;
// }

// function calculateEnd(startDate, length = 1) {
//   const endDate = addWeekdays(startDate, length);
//   return endDate.toISOString().split("T")[0];
// }

function splitUnitIntoChunks(startDate, unitLength, blockedDates = []) {

  const blocked = new Set(blockedDates);
  const resultChunks = [];

 

  let current = new Date(startDate + 'T00:00:00');

  let daysAdded = 0;
  let currentChunkStart = null;
  let currentChunkLength = 0;

  const isValid = (date) => {
    const day = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    return day !== 0 && day !== 6 && !blocked.has(dateStr);
  };

  while (daysAdded < unitLength) {
    const isDateValid = isValid(current);
    if (isDateValid) {
      if (!currentChunkStart) {
        currentChunkStart = new Date(current);
        currentChunkLength = 1;
      } else {
        currentChunkLength += 1;
      }
	  
      daysAdded++;
    }

	
    const tomorrow = new Date(current);
    tomorrow.setDate(current.getDate() + 1);
    const isTomorrowValid = isValid(tomorrow);

    // If tomorrow is invalid OR we've reached unitLength, close the chunk
    if (!isTomorrowValid || daysAdded === unitLength) {
      if (currentChunkStart) {
        const chunkEnd = new Date(currentChunkStart);
		let chunkDays = 0;
		while (chunkDays < currentChunkLength) {
		const temp = new Date(chunkEnd);
		if (isValid(temp)) chunkDays++;
		if (chunkDays < currentChunkLength) chunkEnd.setDate(chunkEnd.getDate() + 1);
		}
		// Add one more day to account for FullCalendar’s exclusive end
		chunkEnd.setDate(chunkEnd.getDate() + 1);

		resultChunks.push({
		start: currentChunkStart.toISOString().split('T')[0],
		end: chunkEnd.toISOString().split('T')[0],
		});

        currentChunkStart = null;
        currentChunkLength = 0;
      }
    }

    current.setDate(current.getDate() + 1);
  }


  return resultChunks;
}

const SchoolYearCalendar = () =>{

	const { id } = useParams();
  	const [schoolYear, setSchoolYear] = useState(null);
 	const [loading, setLoading] = useState(true);
	const { units, fetchUnits } = useContext(UnitContext);
	const { classes } = useContext(ClassContext);
	const { selectedClassId, setSelectedClassId } = useSelectedClass();
	// const [events, setEvents] = useState([]);

	const selectedClass = classes.find(cls => cls.id === selectedClassId);

	const outOfServiceDaysList = schoolYear?.out_of_service_days?.map(day => day.date) || [];

	const buildEvents = (schoolYear, units = [], selectedClass = null) => {
		const events = [];

		events.push({
			title: "School Year Start" ,
			start: schoolYear.start_date,
			allDay: true,
			backgroundColor: "#4CAF50",
			borderColor: "#4CAF50",
			textColor: "#FFFFFF" 
		})

		events.push({
			title: "School Year End",
			start: schoolYear.end_date,
			allDay: true,
			backgroundColor: "#F44336",
			borderColor: "#F44336",
			textColor: "#FFFFFF"
		})

		schoolYear.terms.forEach((term,idx) => {
			events.push({
				title: `${term.name} Start`,
				start: term.start_date,
				allDay: true,
				backgroundColor: "#2196F3",
				borderColor: "#2196F3",
				textColor: "#FFFFFF"
			})

			events.push({
				title: `${term.name} End`,
				start: term.end_date,
				allDay: true,
				backgroundColor: "#FF9800",
				borderColor: "#FF9800",
				textColor: "#FFFFFF"
			})
		})

		schoolYear.out_of_service_days.forEach((day) => {
			events.push({
				title: "No School",
				start: day.date,
				allDay: true,
				backgroundColor: "#d3d3d3",
				borderColor: "#d3d3d3",
				textColor: "#fa0505ff"
			})
		})

		// console.log("Outside of the if in build events")
		// console.log("Checking if we selectedClass:", selectedClass)
		if (selectedClass) {
			const seenUnitIds = new Set();

			units
				.filter(unit => unit.class_obj === selectedClass.id && unit.start_date)
				.forEach(unit => {
				if (!seenUnitIds.has(unit.id)) {
					seenUnitIds.add(unit.id);

					const chunks = splitUnitIntoChunks(unit.start_date, unit.length, outOfServiceDaysList);

					chunks.forEach((chunk, index) => {
					events.push({
						id: `${unit.id}-${index}`,         // unique per chunk
						groupId: unit.id,                  // same group for movement
						title: unit.name,
						start: chunk.start,
						end: chunk.end,
						backgroundColor: unit.color || '#3788d8',
						borderColor: unit.color || '#3788d8',
						textColor: '#ffffff',
						allDay: true,
						editable: true
					});
					});
				}
				});
			}
		
		return events
	}

	const memoizedEvents = useMemo(() => {
		if (!schoolYear) return [];
		return buildEvents(schoolYear, units, selectedClass);
	}, [schoolYear, units, selectedClass]);


	const handleUnitDrop = async (info) => {
		try {
			const event = info.event;
			const unitId = event.id;
			const startDate = event.start;
			const endDate = event.end; // 'YYYY-MM-DD'

			await AxiosInstance.patch(`/unit/${unitId}/`, {
			start_date: startDate,
			end_date: endDate,
			});
			await fetchUnits();


		} catch (error) {
			console.error('Error updating unit placement:', error);
		}
		};
	
	useEffect(() => {
		// Reset selected class when calendar changes
		setSelectedClassId(null);
	}, [id]);


	useEffect(() => {
		const fetchSchoolYear = async () => {
			try {
				const response = await AxiosInstance.get(`schoolyear/${id}/`);
				setSchoolYear(response.data);
				
			} catch (error) {
				console.error('Error fetching school year data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchSchoolYear();
	}, [id]);

	
	
	if (loading) return <p>Loading calendar...</p>;
	if (!schoolYear) return <p>School year not found.</p>;
	
	// const outOfServiceDaysList = schoolYear.out_of_service_days.map(day=>day.date)
	const blockedEvents = outOfServiceDaysList.map(date => ({
		title: '',
		start: date,
		allDay: true,
		display: 'background', // makes it non-interactive
		backgroundColor: '#d3d3d3',
	}));
	
	const handleEventDrop = async (info) => {
		const { event } = info;
		console.log("Checking what event looks like:", event)
		const unitId = event.groupId;
		const newStart = event.start;
		const newEnd = event.end;


		try {
			await AxiosInstance.patch(`/unit/${unitId}/`, {
			start_date: newStart.toISOString().split('T')[0],
			end_date: newEnd.toISOString().split('T')[0],
			});
			await fetchUnits();
			console.log(`Unit ${unitId} updated to ${newStart}–${newEnd}`);
		} catch (error) {
			console.error('Failed to update unit after drag:', error);
			info.revert();
		}
	};

	const handleRemoveAllUnits = async () => {
		if (!selectedClass) {
			alert('Please select a class first.');
			return;
		}

		const confirmed = window.confirm('Are you sure you want to remove all placed units? This cannot be undone.');
		if (!confirmed) return;

		try {
			const unitsToUpdate = units.filter(
			unit => unit.class_obj === selectedClass.id && unit.start_date
			);

			await Promise.all(
			unitsToUpdate.map(unit =>
				AxiosInstance.patch(`/unit/${unit.id}/`, {
				start_date: null,
				end_date: null,
				})
			)
			);

			await fetchUnits(); // Refresh unit list
			console.log('All placed units removed.');
		} catch (error) {
			console.error('Failed to remove units:', error);
		}
		};

		const handleEventClick = async (clickInfo) => {
			const event = clickInfo.event;

			// Only allow deletion for unit events (not term dates, etc.)
			if (!event.extendedProps || !event.id) return;

			const confirmed = window.confirm(`Remove unit "${event.title}" from calendar?`);
			if (!confirmed) return;

			try {
				await AxiosInstance.patch(`/unit/${event.id}/`, {
				start_date: null,
				end_date: null,
				});

				await fetchUnits(); // Refresh updated data
				console.log(`Unit ${event.title} removed from calendar.`);
			} catch (error) {
				console.error('Error removing unit:', error);
			}
			};
	
	return(
		<>
		<h2>{schoolYear?.schoolyear}</h2>
		{schoolYear ? (<MyCalendar1 
			start_date={schoolYear.start_date}
			end_date={schoolYear.end_date}
			blockedDatesStr={outOfServiceDaysList}
			events={memoizedEvents}
			weekends={schoolYear.weekends}
			handleDrop={handleUnitDrop}
			handleEventDrop={handleEventDrop}
			removeAllUnits={handleRemoveAllUnits}
			handleEventClick={handleEventClick}
			blockedEvents={blockedEvents}
		/>) : (
			<p>Loading Calendar...</p>
		)}
		</>
	)
}

export default SchoolYearCalendar