import React, { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'
import toast, { Toaster } from 'react-hot-toast'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuthStore } from '../store'
import { useFetch } from '../hooks/fetch'
import { loginUser } from '../helper/helper'

const Password = () => {

    const navigate = useNavigate()
    const username = useAuthStore(state => state.auth.username)
    const [showPassword, setShowPassword] = useState(false)

    const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

    useEffect(() => {
        console.log(apiData);
    })

    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validate: passwordValidate, // when user click submit btn first validate input textbox then return value 
        validateOnBlur: false, // validate when user click submit btn, ussy pehly direct validate nhi hogi field
        validateOnChange: false,
        onSubmit: (values, action) => {
            console.log(values);
            let passwordPromise = loginUser({ username, password: values.password }) // return promise
            toast.promise(passwordPromise, {
                loading: "Checking...",
                success: <b>Login Successfully...!</b>,
                error: <b>Password not Match...!</b>
            })
            passwordPromise.then(res => {
                let { token } = res.data
                localStorage.setItem('token', token)
                navigate('/profile')
            })
            action.resetForm()
        }
    })

    if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Hello {apiData?.userInfo?.firstname || apiData?.userInfo?.username}</h4>
                        <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
                            Explore More by connecting with us
                        </span>
                    </div>

                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className='profile flex justify-center py-4'>
                            <img src={apiData?.userInfo?.profile || avatar} className={styles.profile_img} alt="avatar" />
                        </div>
                        <div className="textbox flex flex-col items-center gap-6">
                            {
                                !showPassword ?
                                    <>
                                        <div className='relative'>
                                            <AiOutlineEye
                                                className={styles.password_icon}
                                                onClick={() => setShowPassword(!showPassword)} />
                                            <input
                                                className={styles.textbox_password}
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder='Password'
                                                value={formik.values.password}
                                                onChange={formik.handleChange} />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className='relative'>
                                            <AiOutlineEyeInvisible
                                                className={styles.password_icon}
                                                onClick={() => setShowPassword(!showPassword)} />
                                            <input
                                                className={styles.textbox_password}
                                                type="text"
                                                name="password"
                                                id="password"
                                                placeholder='Password'
                                                value={formik.values.password}
                                                onChange={formik.handleChange} />
                                        </div>
                                    </>
                            }
                            <button className={`${styles.btn} bg-indigo-500`} type="submit">Sign In</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>Forget Password?
                                <NavLink className=' text-red-500' to={'/recovery'}> Recover Now</NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Password