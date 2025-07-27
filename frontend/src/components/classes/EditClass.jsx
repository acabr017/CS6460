import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import AxiosInstance from '../axios';
import ClassForm from './ClassForm';
import { ClassContext } from '../ClassContext';
import { CircularProgress, Box } from '@mui/material';

const EditClass = () => {
  const { id } = useParams(); // Get class ID from URL
  const navigate = useNavigate();
  const { fetchClasses } = useContext(ClassContext);

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await AxiosInstance.get(`/class/${id}/`);
        const classData = response.data;

        setInitialData({
          name: classData.name,
          schoolYearId: classData.school_year || '',
        });
      } catch (error) {
        console.error('Failed to fetch class data:', error);
        navigate('/'); // Redirect if class doesn't exist
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id, navigate]);

  const handleUpdateClass = async (payload) => {
    try {
      await AxiosInstance.patch(`/class/${id}/`, payload);
    } catch (error) {
      throw error; // let the form component handle the error
    }
  };

  if (loading || !initialData) {
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ClassForm
      initialData={initialData}
      onSubmit={handleUpdateClass}
      buttonLabel="Update"
    />
  );
};

export default EditClass;