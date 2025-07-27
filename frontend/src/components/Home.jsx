import {React, useEffect, useMemo, useState} from 'react'
import AxiosInstance from './axios'
import {Box} from '@mui/material'

const Home = () =>{
	const [myData, setMyData] = useState()
	const [loading, setLoading] = useState(true)

	const GetData = () => {
		AxiosInstance.get('users/users/').then((res) => {
			setMyData(res.data)
			console.log(res.data)
			setLoading(false)
		})
	}

	useEffect(() =>{
		GetData();
	}, [])
	return(
		<div>
			{/* { loading ? <p>Loading data...</p> :
			<div>
				{myData.map((item, index) => (
					<Box key={index} sx={{p:2, m:2, boxShadow:3}}>
						<div>ID: {item.id}</div>
						<div>Email: {item.email}</div>
					</Box>
				)
				)}
			</div>
			} */}
			Home Page
		</div>
	)
}

export default Home