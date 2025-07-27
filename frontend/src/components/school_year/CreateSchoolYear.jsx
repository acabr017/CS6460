import React from 'react';
import AxiosInstance from '../axios'
import {useNavigate} from 'react-router'
import { useContext } from 'react';
import { SchoolYearContext } from '../SchoolYearContext';
import SchoolYearForm from './SchoolYearForm';


const CreateSchoolYear = () => {

	const navigate = useNavigate();
	const { fetchSchoolYears } = useContext(SchoolYearContext);

	

	const handleCreateSchoolYear = async (payload) => {
		
		console.log('Payload:', payload)

		try {
			const response = await AxiosInstance.post("schoolyear/", payload);
			console.log("Response:", response);
			fetchSchoolYears();
			
			if (response.status === 201 || response.status === 200) {
				// console.log("Success:", response.data);
				setTimeout(() => {
					navigate('/');
				}, 2000);
				}
			
		} catch (error) {
			console.error("I'm the one writing this, right? Backend error:", error.response?.data);
			throw error;
		}
	}


	return(
		<SchoolYearForm 
			onSubmit={handleCreateSchoolYear}
			buttonLabel="Create"
		/>
		
  );
}


export default CreateSchoolYear