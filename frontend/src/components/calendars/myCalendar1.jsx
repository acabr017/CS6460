import {React, useRef , useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import {useNavigate} from 'react-router'
import dayjs from 'dayjs';

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

// function calculateSkippedRange(rawStartDate, length, blockedDatesStr) {
// 	console.log("BlockedDates:",blockedDatesStr)
//   	const isBlocked = (date) => {
//     const day = date.getDay();
//     const dateStr = date.toISOString().split("T")[0];
// 	console.log("Checking truthy:", day === 0 || day === 6 || blockedDatesStr.includes(dateStr))
//     return day === 0 || day === 6 || blockedDatesStr.includes(dateStr);
//   };

//   let startDate = new Date(rawStartDate);

//   // STEP 1: Shift startDate forward until it's a valid day
//   while (isBlocked(startDate)) {
//     startDate.setDate(startDate.getDate() + 1);
//   }

//   // STEP 2: Collect valid days, skipping over blocked/weekend dates
//   const resultDates = [];
//   let current = new Date(startDate);

//   while (resultDates.length < length) {
//     if (!isBlocked(current)) {
//       resultDates.push(new Date(current));
//     }
//     current.setDate(current.getDate() + 1);
//   }

//   console.log("Checking the resultDates array:", resultDates)

//   // STEP 3: Return formatted start and end
//   const start = resultDates[0].toISOString().split("T")[0];
//   const end = resultDates[resultDates.length - 1].toISOString().split("T")[0];
//   console.log("Checking the dates:", start, end)
//   return { start, end };
// }

function splitUnitIntoChunks(startDate, unitLength, blockedDates = []) {
  const blocked = new Set(blockedDates);
  const resultChunks = [];
  let current = new Date(startDate);
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

const MyCalendar1 = ({
	start_date,
	end_date,
	blockedDatesStr,
	events,
	weekends = false,
	handleDrop,
	handleEventDrop,
	removeAllUnits,
	handleEventClick,
	blockedEvents, 
}) => {

	const navigate = useNavigate()
	const calendarRef = useRef(null);


	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[ dayGridPlugin, multiMonthPlugin, interactionPlugin ]}
			
			weekends={weekends}
			visibleRange={{
			start: start_date,
			end: end_date
			}}
			views={{
			multiMonthFour: {
				type: 'multiMonth',
				duration: {months:4},
				dateIncrement: {months: 4}
			},
			multiMonthTwelve: {
				type: 'multiMonth',
				duration: {months:12},
				dateIncrement: {months: 12}
			}
			}}
			initialView="multiMonthTwelve"
			multiMonthMaxColumns={2}
			buttonText={{
			multiMonthFour: 'quarter',
			multiMonthTwelve: 'year'	
			}}

			headerToolbar = {{
			left: 'prev,next, addClassButton, deleteAllUnitsButton',
			center: 'title',
			right: 'dayGridWeek, dayGridMonth, multiMonthFour, multiMonthTwelve'
			}}
			selectAllow={(selectInfo) => {
			const dateStr = selectInfo.startStr
			return !blockedDatesStr.includes(dateStr)
			}}
			events={[...events,...blockedEvents]}
			height="800px"
			customButtons={{
				addClassButton: {
					text: "+ Class",
					click: () => {
						navigate('/class/create');
					}
				},
				deleteAllUnitsButton: {
					text: "Delete All Units",
					click: removeAllUnits
				}
			}}
			eventDurationEditable={false}
			editable={true}
			droppable={true}
			// drop={handleDrop}
			// eventAllow={(dropInfo, draggedEvent) => {
			// 	const startStr = dropInfo.startStr;
			// 	const endStr = dropInfo.endStr;

			// 	// Check if any date between start and end overlaps with a blocked date
			// 	const blocked = new Set(blockedDatesStr);
			// 	const date = new Date(startStr);
			// 	const endDate = new Date(endStr);

			// 	while (date < endDate) {
			// 		const iso = date.toISOString().split("T")[0];
			// 		if (blocked.has(iso)) return false;
			// 		date.setDate(date.getDate() + 1);
			// 	}

			// 	return true;
			// 	}}
			eventReceive={(info) => {
				const data = JSON.parse(info.draggedEl.getAttribute('data-event'));
				const unitLength = data.length || 1;
				const unitId = data.id;
				const originalStart = new Date(info.event.start);

				const chunks = splitUnitIntoChunks(originalStart, unitLength, blockedDatesStr);

				info.event.remove(); // remove default placeholder

				const calendarApi = info.view.calendar;

				chunks.forEach((chunk, index) => {
					calendarApi.addEvent({
					id: `${unitId}-${index}`,
					groupId: unitId,
					title: data.title,
					start: chunk.start,
					end: chunk.end,
					allDay: true,
					});
				});

				// Optional: Persist to backend (could store chunks or just first+length)
				handleDrop({
					event: {
					id: unitId,
					start: chunks[0].start,
					end: chunks[chunks.length - 1].end,
					}
				});

			}}
			eventDrop={handleEventDrop}
			eventClick={handleEventClick}

	  
    />
	)
}

export default MyCalendar1


// console.log("Dragged DOM element data-event:", draggedData);
				// console.log("Did we make it here? check event:", event)
				// console.log("Parsed event data:", JSON.parse(draggedData));