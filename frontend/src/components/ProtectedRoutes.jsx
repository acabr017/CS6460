import {Outlet, Navigate} from 'react-router'

const ProtectedRoute = () => {
	const token = localStorage.getItem('Token')

	return(
		token ? <Outlet/> : <Navigate to="/login"/>
	)
}

export default ProtectedRoute