import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import AxiosInstance from '../axios'
import {useParams, useNavigate} from 'react-router'
import SchoolYearForm from './SchoolYearForm';




const EditSchoolYear = () => {

	const { id } = useParams();
	const navigate = useNavigate();
	
	const [initialData, setInitialData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	

	useEffect(() => {
		const fetchSchoolYear = async () => {
			try {
				const response = await AxiosInstance.get(`schoolyear/${id}/`);
				const data = response.data;

				console.log("In Edit school year, checking data:",data)

				setInitialData({
					startDate: dayjs(data.start_date),
					endDate: dayjs(data.end_date),
					includeWeekends: data.weekends,
					defineHolidays: data.out_of_service_days?.length > 0,
					outOfServiceDays: data.out_of_service_days?.map((day) => dayjs(day.date)),
					customTerms: data.terms.length > 0,
					termCount: data.terms.length,
					termDates: data.terms.map((term) => ({
						name: term.name,
						start: term.start_date ? dayjs(term.start_date) : null,
						end: term.end_date ? dayjs(term.end_date) : null,
					})),
				});
			} catch (error) {
				console.error('Error fetching school year data:', error);
				setError('Failed to load school year data.');
			} finally {
				setLoading(false);
			}
		};
		console.log(initialData)
		fetchSchoolYear();
	}, [id]);

	const handleUpdate = async (payload) => {
		try {
			const response = await AxiosInstance.put(`schoolyear/${id}/`, payload);
			console.log('Updated successfully:', response.data);
			navigate(`/school_year/${id}/`)
		} catch (error) {
			console.error('Error updating school year:', error);
			setError('Failed to update school year.');
		}
	};

	if (loading) return <p>Loading school year....</p>
	if (error) return <p>{error}</p>	

	// console.log("Still in EditSchoolYear", data.out_of_service_days)
	console.log("In EditSchoolYear.jsx", initialData.outOfServiceDays)

	return(
		<SchoolYearForm
			initialData={initialData}
			onSubmit={handleUpdate}
			buttonLabel="Update"
		/>
  );
}


export default EditSchoolYear