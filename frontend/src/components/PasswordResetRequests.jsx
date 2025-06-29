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

const PasswordResetRequest = () =>{
	const navigate = useNavigate()
	const {handleSubmit, control} = useForm()

	const [ShowMessage, setShowMessage] = useState(false)

	const submission = (data) => {
		AxiosInstance.post(
			'api/password_reset/',{
				email: data.email,
				
			})
			.then((response) => {
				setShowMessage(true)
			})
			
	}
	return(
		<div className={"myBackground"}>
			{ShowMessage ? <MyMessage text={"If your email exists, you have received an email with instructions for resetting your password."}/> : null}
					<form onSubmit={handleSubmit(submission)}>
						
						<Box className={'whiteBox'}>
							
							<Box className={"itemBox"}>
								<Box className={"title"}>
									Password Reset
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
								<MyButton 
								label={"Reset Password"}
								type={'submit'}/>
							</Box>
							
		
		
						</Box>
					</form>
				</div>
	)
}

export default PasswordResetRequest