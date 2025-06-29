import React from 'react'
import '../App.css'
import {Box} from '@mui/material'
import MyTextField from './forms/MyTextFields'
import MyPasswordField from './forms/MyPasswordField'
import MyButton from './forms/MyButton'
import {Link} from 'react-router'
import {useForm} from 'react-hook-form'
import AxiosInstance from './axios'
import {useNavigate} from 'react-router'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from "yup"

const Register = () =>{
	const navigate = useNavigate()
	

	const schema = yup
	.object({
		email: yup.string().email('Input must be a valid email address.').required('Email is a required field.'),
		password: yup.string()
			.required("Password is a required field.")
			.min(8, "Password must be at least 8 characters long.")
			.matches(/[A-Z]/,"Password must contain at least one uppercase letter.")
			.matches(/[a-z]/, "Password must contain at least one lower case letter.")
			.matches(/[0-9]/, "Password must contain at least one number.")
			.matches(/[!@#$%^&*,.]/, "Password must contain at least one special character:\n!@#$%^&*,."),
		password2: yup.string().required("Please confirm your password.").oneOf([yup.ref('password'),null], "Both password fields must match.")

	})
	const {handleSubmit, control} = useForm({
		resolver:yupResolver(schema)
	})

	const submission = (data) => {
		AxiosInstance.post(
			'users/register/',{
				email: data.email,
				password: data.password,
			})
			.then(() => {
				navigate('/')
			})
	}

	return(
		<div className={"myBackground"}>
			<form onSubmit={handleSubmit(submission)}>
				<Box className={'whiteBox'}>
					
					<Box className={"itemBox"}>
						<Box className={"title"}>
							Account Registration
						</Box>
					</Box>
					<Box className={"itemBox"}>
						<MyTextField 
							label={"Email"}
							name={"email"}
							control={control}
						/>
					</Box>
					<Box className={"itemBox"}>
						<MyPasswordField 
							label={"Password"}
							name={"password"}
							control={control}
						/>
					</Box>
					<Box className={"itemBox"}>
						<MyPasswordField 
							label={"Confirm Password"}
							name={"password2"}
							control={control}	
						/>
					</Box>
					<Box className={"itemBox"}>
						<MyButton type={"submit"} label={"Register"}/>
					</Box>
					<Box className={"itemBox"}>
						<Link to="/login"> Already registered? Login</Link>
					</Box>


				</Box>
			</form>
		</div>
	)
}

export default Register