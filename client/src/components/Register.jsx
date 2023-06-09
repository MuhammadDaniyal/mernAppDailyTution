import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import toast, { Toaster } from 'react-hot-toast'
import { convertToBase64 } from '../helper/convertBase64'
import { registerUser } from '../helper/helper'

const Register = () => {
    const navigate = useNavigate()
    const [file, setFile] = useState()

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: ''
        },
        validate: registerValidation, // when user click submit btn first validate input textbox then return value 
        validateOnBlur: false, // validate when user click submit btn, ussy pehly direct validate nhi hogi field
        validateOnChange: false,
        onSubmit: (values, action) => {
            values = Object.assign(values, { profile: file || " " })
            console.log(values);
            let registerPromise = registerUser(values)
            toast.promise(registerPromise, {
                loading: "Creating...",
                success: <b>Register Successfully...!</b>,
                error: <b>Could not Register...!</b>
            })
            registerPromise.then(() => navigate('/'))
            action.resetForm()
        }
    })

    /** formik dosen't support file upload so we need to create this handler */
    const onUploadPicHandler = async (e) => {
        const base64 = await convertToBase64(e.target.files[0]) // convert this img to base64 so we can store this image into database
        setFile(base64)
    }

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={`${styles.glass}`} style={{ width: "45%", padding: "20px 6px " }}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Register</h4>
                        {/* <span className='py-2 text-xl w-2/3 text-center text-gray-500'>
                            Happy to join you
                        </span> */}
                    </div>

                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className='profile flex justify-center pt-2 pb-4'>
                            <label htmlFor="profile-img">
                                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
                            </label>
                            <input onChange={onUploadPicHandler} className='hidden' type="file" name="profile-img" id="profile-img" />
                        </div>
                        <div className="textbox flex flex-col items-center gap-4">
                            <input
                                className={styles.textbox}
                                type="email"
                                name="email"
                                id="email"
                                placeholder='Email*'
                                value={formik.values.email}
                                onChange={formik.handleChange} />
                            <input
                                className={styles.textbox}
                                type="text"
                                name="username"
                                id="username"
                                placeholder='Username*'
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                            <input
                                className={styles.textbox}
                                type="password"
                                name="password"
                                id="password"
                                placeholder='Password*'
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                            <button className={`${styles.btn} bg-indigo-500`} type="submit">Sign Up</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>Already Member
                                <NavLink className=' text-red-500' to={'/'}> Login Now</NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register