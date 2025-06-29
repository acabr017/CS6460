import {React, useState} from 'react'
import '../App.css'
import {Box} from '@mui/material'
import MyTextField from './forms/MyTextFields'
import MyPasswordField from './forms/MyPasswordField'
import MyButton from './forms/MyButton'
import {Link} from 'react-router'
import {useNavigate, useParams} from 'react-router'
import {useForm} from 'react-hook-form'
import AxiosInstance from './axios'
import MyMessage from './Message'

const PasswordReset = () =>{
	const navigate = useNavigate()
	const {handleSubmit, control} = useForm()
	const {token} = useParams()
	console.log(token)
	const [ShowMessage, setShowMessage] = useState(false)

	const submission = (data) => {
		AxiosInstance.post(
			'api/password_reset/confirm/',{
				password: data.password,
				token: token,
				
			})
			.then((response) => {
				setShowMessage(true)
				setTimeout(() =>{
					navigate('/')
				})
			})
			
	}
	return(
		<div className={"myBackground"}>
			{ShowMessage ? <MyMessage text={"Password successfully reset. Redirecting to login page..."} color={'#69C9AB'}/> : null}
					<form onSubmit={handleSubmit(submission)}>
						
						<Box className={'whiteBox'}>
							
							<Box className={"itemBox"}>
								<Box className={"title"}>
									Reset Password
								</Box>
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
								<MyButton 
								label={"Reset Password"}
								type={'submit'}/>
							</Box>
							
		
		
						</Box>
					</form>
				</div>
	)
}

export default PasswordReset