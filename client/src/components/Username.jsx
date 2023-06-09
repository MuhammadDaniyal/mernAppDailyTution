import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { useFormik } from 'formik'
import { usernameValidate } from '../helper/validate'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store'

const Username = () => {

    const navigate = useNavigate()

    const setUsername = useAuthStore(state => state.setUsername)

    const formik = useFormik({
        initialValues: {
            username: ''
        },
        validate: usernameValidate, // when user click submit btn first validate input textbox then return value 
        validateOnBlur: false, // validate when user click submit btn, ussy pehly direct validate nhi hogi field
        validateOnChange: false,
        onSubmit: (values, action) => {
            console.log(values);
            setUsername(values.username)
            navigate('/password')
            action.resetForm()
        }
    })

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Hello Again!</h4>
                        <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
                            Explore More by connecting with us
                        </span>
                    </div>

                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className='profile flex justify-center py-4'>
                            <img src={avatar} className={styles.profile_img} alt="avatar" />
                        </div>
                        <div className="textbox flex flex-col items-center gap-6">
                            <input
                                className={styles.textbox}
                                type="text"
                                name="username"
                                id="username"
                                placeholder='Username'
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                            <button className={`${styles.btn} bg-indigo-500`} type="submit">Let's Go</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>Not a Member
                                <NavLink className=' text-red-500' to={'/register'}> Register Now</NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Username