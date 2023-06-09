import toast from 'react-hot-toast'
import { authenticate } from './helper'

/** validate login username */
export async function usernameValidate(values) {
    const error = usernameVerify({}, values)
    if (values.username) {
        // check the user exist or not
        const { status } = await authenticate(values.username)

        if (status !== 200) {
            error.exist = toast.error('Username not found...!')
        }
    }
    return error
}

/** validate username */
function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error('Username Required...!')
    } else if (values.username.includes(' ')) {
        error.username = toast.error('Invalid Username...!')
    }

    return error // if we have error only then we have value inside this error object 
}

/** validate login password */
export function passwordValidate(values) {
    const error = passwordVerify({}, values)
    return error
}


/** validate password */
function passwordVerify(error = {}, values) {
    /* eslint-disable no-useless-escape */
    const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    if (!values.password) {
        error.password = toast.error('Password Required...!')
    } else if (values.password.includes(' ')) {
        error.password = toast.error('Invalid Password...!')
    } else if (values.password.length < 5) {
        error.password = toast.error('Password must be more than 4 characters long')
    } else if (!specialChar) {
        error.password = toast.error('Password must have special character')
    }

    return error // if we have error only then we have value inside this error object 
}

/** validate reset passoword */

export function resetPasswordValidation(values) {
    const error = passwordVerify({}, values)
    if (values.password !== values.confirm_password) {
        error.exist = toast.error('Password not match...!')
    }
    return error
}

/** validate email */
function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error("Email Required...!");
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email...!")
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}

/** validate register */

export function registerValidation(values) {
    const error = emailVerify({}, values)
    passwordVerify(error, values)
    usernameVerify(error, values)

    return error
}

/** validate profile page */
export function profileValidation(values) {
    const errors = emailVerify({}, values);
    return errors;
}
