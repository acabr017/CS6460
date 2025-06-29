import {React} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'

const MyCalendar1 = () => {

	const blockedDatesStr = ['2025-11-24', '2025-11-25', '2025-11-26', '2025-11-27', '2025-11-28']
	const bD = [
		{start:'2025-11-24', display: 'background', color:'#d3d3d3'},
		{start:'2025-11-25', display: 'background', color:'#d3d3d3'},
		{start:'2025-11-26', display: 'background', color:'#d3d3d3'},
		{start:'2025-11-27', display: 'background', color:'#d3d3d3'},
		{start:'2025-11-28', display: 'background', color:'#d3d3d3'},
]

	return (
		<FullCalendar
      plugins={[ dayGridPlugin, multiMonthPlugin ]}
      initialView="multiMonthYear"
	  weekends={false}
	  views={{
		multiMonthFour: {
			type: 'multiMonth',
			duration: {months:4},
			dateIncrement: {months: 4}
		}
	  }}
	  multiMonthMaxColumns={2}
	  buttonText={{
		multiMonthFour: 'Quarter'	
		}}

	  headerToolbar = {{
		left: 'prev,next',
		center: 'title',
		right: 'dayGridWeek, dayGridMonth, multiMonthFour, multiMonthYear'
	  }}
	  selectAllow={(selectInfo) => {
		const dateStr = selectInfo.startStr
		return !blockedDatesStr.includes(dateStr)
	  }}
	  events={bD}
    />
	)
}

export default MyCalendar1