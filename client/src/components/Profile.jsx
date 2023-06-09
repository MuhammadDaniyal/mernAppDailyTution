import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import toast, { Toaster } from 'react-hot-toast'
import { convertToBase64 } from '../helper/convertBase64'
import { useFetch } from '../hooks/fetch'
import { updateUser } from '../helper/helper'
// import { useAuthStore } from '../store'

import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'

const Profile = () => {
    const [file, setFile] = useState()
    // console.log("file", file);

    const navigate = useNavigate()

    // const username = useAuthStore(state => state.auth.username) // reload browser zustand reset the value
    const [{ isLoading, apiData, serverError }] = useFetch()

    const formik = useFormik({
        initialValues: {
            firstname: apiData?.userInfo?.firstname || '',
            lastname: apiData?.userInfo?.lastname || '',
            email: apiData?.userInfo?.email || '',
            mobileno: apiData?.userInfo?.mobileno || '',
            address: apiData?.userInfo?.address || ''
        },
        enableReinitialize: true,
        validate: profileValidation, // when user click submit btn first validate input textbox then return value 
        validateOnBlur: false, // validate when user click submit btn, ussy pehly direct validate nhi hogi field
        validateOnChange: false,
        onSubmit: (values, action) => {
            values = Object.assign(values, { profile: file || apiData?.userInfo?.profile || " " })
            console.log(values);
            let updatePromise = updateUser(values) // return promise
            toast.promise(updatePromise, {
                loading: "Updating...",
                success: <b>Update Successfully...!</b>,
                error: <b>could not update...!</b>
            })

            // action.resetForm()
        }
    })

    /** formik dosen't support file upload so we need to create this handler */
    const onUploadPicHandler = async (e) => {
        const base64 = await convertToBase64(e.target.files[0]) // convert this img to base64 so we can store this image into database
        setFile(base64)
    }

    /** LogoutUser */
    function LogoutUser() {
        localStorage.removeItem('token')
        navigate('/')
    }

    if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={`${styles.glass}`} style={{ width: "45%", padding: "20px 6px " }}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Profile</h4>
                        {/* <span className='py-2 text-xl w-2/3 text-center text-gray-500'>
                            Happy to join you
                        </span> */}
                    </div>

                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className='profile flex justify-center pt-2 pb-4'>
                            <label htmlFor="profile-img">
                                <img src={file || apiData?.userInfo?.profile || avatar} className={styles.profile_img} alt="avatar" />
                            </label>
                            <input onChange={onUploadPicHandler} className='hidden' type="file" name="profile-img" id="profile-img" />
                        </div>
                        <div className="textbox flex flex-col items-center gap-4">
                            <div className="name flex w-5/6 gap-4">
                                <input
                                    className={`${extend.textbox}`}
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder='FirstName*'
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange} />
                                <input
                                    className={`${extend.textbox}`}
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    placeholder='LastName*'
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange} />
                            </div>
                            <div className="name flex w-5/6 gap-4">
                                <input
                                    className={`${extend.textbox}`}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder='Email*'
                                    value={formik.values.email}
                                    onChange={formik.handleChange} />
                                <input
                                    className={`${extend.textbox}`}
                                    type="text"
                                    name="mobileno"
                                    id="mobileno"
                                    placeholder='Mobile No.*'
                                    value={formik.values.mobileno}
                                    onChange={formik.handleChange} />
                            </div>
                            <input
                                className={`${extend.textbox}`}
                                type="text"
                                name="address"
                                id="address"
                                placeholder='Address*'
                                value={formik.values.address}
                                onChange={formik.handleChange} />
                            <button className={`${extend.btn} bg-indigo-500`} type="submit">Update</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>come back later?
                                <NavLink onClick={LogoutUser} className=' text-red-500' to={'/'}> Logout</NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile