import {React, useState} from 'react'
import '../App.css'
import {Box} from '@mui/material'
import MyTextField from './forms/MyTextFields'
import MyPasswordField from './forms/MyPasswordField'
import MyButton from './forms/MyButton'
import {Link} from 'react-router'
import {useNavigate} from 'react-router'
import {useForm} from 'react-hook-form'
import AxiosInstance from './axios'
import MyMessage from './Message'


const Login = () =>{
	const navigate = useNavigate()
	const {handleSubmit, control} = useForm()
	const [ShowMessage, setShowMessage] = useState(false)

	const submission = (data) => {
		AxiosInstance.post(
			'users/login/',{
				email: data.email,
				password: data.password,
			})
			.then((response) => {
				console.log(response)
				localStorage.setItem('Token', response.data.token)
				navigate('/')
			})
			.catch((error) => {
				setShowMessage(true)
				// console.error('Error during login', error)
			})
	}
	return(
		<div className={"myBackground"}>
			{ShowMessage ? <MyMessage text={"Failed login. Please retry, or reset password."} color={'#EC5A76'}/> : null}
			<form onSubmit={handleSubmit(submission)}>
				<Box className={'whiteBox'}>
					
					<Box className={"itemBox"}>
						<Box className={"title"}>
							Login
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
						<MyButton 
						label={"Login"}
						type={'submit'}/>
					</Box>
					<Box className={"itemBox"} sx={{flexDirection:"column"}}>
						<Link to="/register"> No account? Click here to register</Link>
						<Link to="/request/password_reset"> Forgot your password? Request a reset.</Link>
					</Box> 


				</Box>
			</form>
		</div>
	)
}

export default Login