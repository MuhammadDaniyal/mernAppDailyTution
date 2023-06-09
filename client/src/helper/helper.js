import axios from 'axios'
import jwt_decode from 'jwt-decode'

// axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN
const baseURL = 'http://localhost:8080'

/** get username from token */
export async function getUsernameDecodeToken() {
    const token = localStorage.getItem('token')
    if (!token) return Promise.reject('Can not find token')
    let decode = jwt_decode(token)
    console.log(decode);
    return decode
}

/** authenticate function */
export async function authenticate(username) {
    try {
        // first acthenticate with verifyUser middleware and then return successful response and return username also
        return await axios.post(`${baseURL}/api/authentication`, { username })
    } catch (error) {
        return { error: "Username doesn't exist...!" }
    }
}

/** get user details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`${baseURL}/api/user/${username}`)
        return { data }
    } catch (error) {
        return { error: "Password doesn't Match...!" }
    }
}

/** register user */
export async function registerUser(credentials) {
    try {
        const { data: { msg }, status } = await axios.post(`${baseURL}/api/register`, credentials)
        let { username, email } = credentials

        // send email
        if (status === ("201" || 201)) {
            await axios.post(`${baseURL}/api/register-mail`, { username, userEmail: email, text: msg })
            return Promise.resolve(msg)
        }
    } catch (error) {
        return Promise.reject({ error })
    }
}

/** login user (verify Passwordf) */
export async function loginUser({ username, password }) {
    try {
        if (username) {
            // const res = await axios.post(`${baseURL}/api/login`, { username, password })
            // console.log("res:", res);
            // let { data } = res

            const { data } = await axios.post(`${baseURL}/api/login`, { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't Match...!" })
    }
}


/** update user profile function */
export async function updateUser(response) {
    try {
        const token = await localStorage.getItem('token');
        const { data } = await axios.put(`${baseURL}/api/update-user`, response,
            {
                // token authenticate the user then return valid userId which will match the user then update it detials
                headers: { "Authorization": `Bearer ${token}` }
            });

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error: "Couldn't Update Profile...!" })
    }
}


/** generate OTP */
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get(`${baseURL}/api/generate-otp`, { params: { username } })
        console.log(code);
        // send mail with OTP
        if (status === 201) {
            let { data: { userInfo } } = await getUser({ username })
            console.log(userInfo.email);
            let text = `Your Password Recovery code is ${code}. Verify and Recover your Password`
            let subject = "Password Recovery OTP"
            await axios.post(`${baseURL}/api/register-mail`, { username, userEmail: userInfo.email, text, subject })
            return Promise.resolve(code)
        }
    } catch (error) {
        return Promise.reject({ error })
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get(`${baseURL}/api/verify-otp`, { params: { username, code } })
        return { data, status }
    } catch (error) {
        return Promise.reject({ error })
    }
}


/** reset password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put(`${baseURL}/api/reset-password`, { username, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}