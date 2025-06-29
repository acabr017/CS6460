import * as React from 'react';
import TextField from '@mui/material/TextField';
import '../../App.css'
import {Controller} from 'react-hook-form'

export default function BasicTextFields(data) {
	const {label, name, control} = data
	return (
		<Controller
			name = {name}
			control = {control}
			render = {({
				field : {onChange, value},
				fieldState : {error},
				formState,
			}) => (
				<TextField 
					id="outlined-basic"
					onChange = {onChange}
					value = {value} 
					label={label} 
					variant="outlined" 
					className={"myForm"}
					error = {!!error}
					helperText = {error?.message}
					/>
			)
			}

		/>
  );
//   return (
//     <Box
//       component="form"
//       sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
//       noValidate
//       autoComplete="off"
//     >
//       <TextField id="outlined-basic" label="Outlined" variant="outlined" />
//       <TextField id="filled-basic" label="Filled" variant="filled" />
//       <TextField id="standard-basic" label="Standard" variant="standard" />
//     </Box>
//   );
}