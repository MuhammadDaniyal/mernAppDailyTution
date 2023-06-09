import { create } from 'zustand'

// which create a central store in your app and can access any variable in whole application

// set - set the new value to the store
export const useAuthStore = create((set) => ({ // return data from this function thast why parathensis
    auth: {
        username: '', // set initial value
        active: false
    },
    // using the action function you set or change the value of store
    // change the initial value with using this function 
    setUsername: (name) => set((state) => ({ auth: { ...state.auth, username: name } }))
}))