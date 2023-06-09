import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store'
import { useState } from 'react'
import { generateOTP, verifyOTP } from '../helper/helper'

const Recovery = () => {

    const navigate = useNavigate()
    const username = useAuthStore(state => state.auth.username)
    const [OTP, setOTP] = useState()

    useEffect(() => {
        // generateOTP(username).then((OTP) => {
        //     if (OTP) {
        //         setOTP(OTP)
        //         return toast.success('OTP has been send to your email!');
        //     }
        //     return toast.error('Problem while generating OTP!')
        // })
        let sendPromise = generateOTP(username)
        toast.promise(sendPromise, {
            loading: "Sending...",
            success: <b>OTP has been send to your email!</b>,
            error: <b>Problem while generating OTP!</b>
        })
        sendPromise.then((OTP) => {
            setOTP(OTP)
            console.log("OTP Send Useffect");
        })
    }, [username])

    async function onSubmit(e) {
        e.preventDefault();
        try {
            let { status } = await verifyOTP({ username, code: OTP })
            if (status === 201) {
                toast.success('Verify Successfully!')
                return navigate('/reset-password')
            }
        } catch (error) {
            return toast.error('Wront OTP! Check email again!')
        }
    }

    // handler for resend OTP
    const resendOTP = () => {
        let sendPromise = generateOTP(username)
        toast.promise(sendPromise, {
            loading: "Sending...",
            success: <b>OTP has been send to your email!</b>,
            error: <b>Couldn't send OTP</b>
        })
        sendPromise.then((OTP) => {
            setOTP(OTP)
            console.log("OTP Send");
        })
    }

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
                <div className={styles.glass}>
                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Recovery</h4>
                        <span className='py-3 pt-5 text-xl w-2/3 text-center text-gray-500'>
                            Enter OTP to recover password
                        </span>
                    </div>

                    <form className='pt-10' onSubmit={onSubmit}>
                        <div className="textbox flex flex-col items-center gap-6">
                            <div className="input text-center">
                                <span className='py-4 text-sm text-left text-gray-500'>

                                    Enter 6 digit OTP sent to your email address.
                                </span>
                                <input
                                    className={styles.textbox}
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder='OTP' />
                            </div>
                            <button className={`${styles.btn} bg-indigo-500`} type="submit">Let's Go</button>
                        </div>
                    </form>
                    <div className='text-center py-4'>
                        <span className='text-gray-500'>Can't get OTP?
                            <button className=' text-red-500' onClick={resendOTP}>  Resend</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recovery