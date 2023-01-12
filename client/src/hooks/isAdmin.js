import jwt from 'jwt-decode'
export default function isAdmin() {
    const token = localStorage.getItem('token')
    if (token) {
        const decoded = jwt(token)
        if (!decoded.role) {
            return false
        }
        if (decoded.role.includes('admin')) {
            return true
        }
    }
    return false
}