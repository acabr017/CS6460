import React, { createContext, useState, useEffect } from 'react';
import AxiosInstance from './axios';

export const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchClasses = async () => {
		setLoading(true)
		try {
			const response = await AxiosInstance.get('class/');
			setClasses(response.data);
		} catch (error) {
			console.error("Failed to fetch classes:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClasses();
	}, [])

	return (
		<ClassContext.Provider value={{ classes, fetchClasses, loading }}>
			{children}
		</ClassContext.Provider>
)
};

