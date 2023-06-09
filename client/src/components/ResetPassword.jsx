import React from 'react'
import styles from '../styles/Username.module.css'
import { useFormik } from 'formik'
import { resetPasswordValidation, usernameValidate } from '../helper/validate'
import toast, { Toaster } from 'react-hot-toast'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

    const navigate = useNavigate()
    const username = useAuthStore(state => state.auth.username)

    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_password: ''
        },
        validate: resetPasswordValidation, // when user click submit btn first validate input textbox then return value 
        validateOnBlur: false, // validate when user click submit btn, ussy pehly direct validate nhi hogi field
        validateOnChange: false,
        onSubmit: (values, action) => {
            let resetPromise = resetPassword({ username, password: values.password })
            toast.promise(resetPromise, {
                loading: "Updating...",
                success: <b>Reset Successfully...! </b>,
                error: <b>Could not reset password</b>
            })
            resetPromise.then(() => {
                navigate('/password')
            })
            action.resetForm()
        }
    })

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass} style={{ width: '40%' }}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Reset</h4>
                        <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
                            Enter new password
                        </span>
                    </div>

                    <form className='py-14' onSubmit={formik.handleSubmit}>
                        <div className="textbox flex flex-col items-center gap-6">
                            <input
                                className={styles.textbox}
                                type="password"
                                name="password"
                                id="password"
                                placeholder='New Password'
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                            <input
                                className={styles.textbox}
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                placeholder='Confirm Password'
                                value={formik.values.confirm_password}
                                onChange={formik.handleChange} />
                            <button className={`${styles.btn} bg-indigo-500`} type="submit">Let's Go</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword