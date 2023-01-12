import jwt_decode from 'jwt-decode'

export default function useLoggedin() {
    const token = localStorage.getItem('token')
    if (token !== null) {
        const decoded = jwt_decode(token)
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token')
            return false
        }
        return true
    }
    return false
}
