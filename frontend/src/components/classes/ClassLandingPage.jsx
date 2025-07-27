import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AxiosInstance from '../axios';
import { SchoolYearContext } from '../SchoolYearContext';
import { ClassContext } from '../ClassContext';

const ClassLandingPage = () => {
  const { id } = useParams(); // class id from URL
  const navigate = useNavigate();
  const { schoolYears } = useContext(SchoolYearContext);
  const { fetchClasses } = useContext(ClassContext);

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClass = async () => {
      try {
        const res = await AxiosInstance.get(`/class/${id}/`);
        setClassData(res.data);
      } catch (err) {
        console.error('Error loading class:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, [id]);

  const getSchoolYearLabel = (schoolYearId) => {
    if (!schoolYearId) return 'None';
    const year = schoolYears.find((y) => y.id === schoolYearId);
    return year ? year.schoolyear : 'None';
  };

  const handleDeleteUnit = async (unitId) => {
    try {
      await AxiosInstance.delete(`/unit/${unitId}/`);
      const updatedUnits = classData.units.filter(unit => unit.id !== unitId);
      setClassData({ ...classData, units: updatedUnits });
      await fetchClasses(); // keep context in sync
    } catch (err) {
      console.error('Error deleting unit:', err);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (!classData) return <Typography variant="h6" sx={{ mt: 4 }}>Class not found.</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      {/* Class Title */}
      <Typography variant="h4" gutterBottom>
        {classData.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        School Year: {getSchoolYearLabel(classData.school_year)}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Units */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Units
      </Typography>

      {classData.units.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          This class has no units yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {classData.units.map((unit) => (
            <Paper key={unit.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                {unit.name} | {unit.length} days
              </Typography>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/unit/edit/${unit.id}`)}
                >
                  <ModeEditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteUnit(unit.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Add Unit Button */}
      <Box sx={{ mt: 4 }}>
        <Button
			variant="contained"
			onClick={() =>
				navigate('/unit/create', {
				state: {
					prefillClassId: classData.id,
					prefillSchoolYearId: classData.school_year,
				},
				})
			}
			>
			Add Unit
		</Button>
      </Box>
    </Box>
  );
};

export default ClassLandingPage;