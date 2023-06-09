import axios from 'axios'
import { useEffect, useState } from 'react'
import { getUsernameDecodeToken } from '../helper/helper'

const baseURL = 'http://localhost:8080'

// custom hook
export function useFetch(query) {
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null,
    })

    useEffect(() => {
        (async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }))
                const { username } = !query ? await getUsernameDecodeToken() : '' // return array result
                const { data, status } = !query ?
                    await axios.get(`${baseURL}/api/user/${username}`) :
                    await axios.get(`${baseURL}/api/${query}`)
                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading: false, apiData: data, status: status }))
                }
                setData(prev => ({ ...prev, isLoading: false }))
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        })()
    }, [query])

    return [getData, setData]
}