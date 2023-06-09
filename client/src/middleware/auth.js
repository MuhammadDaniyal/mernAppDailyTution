import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store'

export function AuthorizeUser({ children }) {
    let token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to={'/'} replace='true' />
    }
    return children
}

export function ProtectPasswordRoute({ children }) {
    const username = useAuthStore(state => state.auth.username)
    if (!username) {
        return <Navigate to={'/'} replace='true' />
    }
    return children
}