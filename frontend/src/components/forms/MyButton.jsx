import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import '../../App.css'

export default function MyButton(data) {
	const {label, type, sx} = data
	return (
		<Button type={type} variant="contained" className={"myButton"} sx={sx}>{label}</Button>
	);
	}
