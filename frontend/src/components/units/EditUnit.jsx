import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import AxiosInstance from '../axios';
import UnitForm from './UnitForm';
import { UnitContext } from '../UnitsContext';

const EditUnit = () => {
  const { id } = useParams(); // unit ID from URL
  const navigate = useNavigate();
  const { fetchUnits } = useContext(UnitContext);

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await AxiosInstance.get(`/unit/${id}/`);
        const unit = response.data;
        setInitialData({
          name: unit.name,
          length: unit.length,
          class_id: unit.class_obj, // locks the class select
          schoolYearId: unit.school_year || '', // optional
        });
      } catch (error) {
        console.error('Failed to fetch unit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  const handleUpdateUnit = async (payload) => {
    try {
      await AxiosInstance.patch(`/unit/${id}/`, payload);
      await fetchUnits();
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Unit not found.</p>;

  return (
    <UnitForm
      initialData={initialData}
      onSubmit={handleUpdateUnit}
      buttonLabel="Update"
    />
  );
};

export default EditUnit;