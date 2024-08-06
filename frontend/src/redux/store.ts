import  {configureStore} from "@reduxjs/toolkit"

 export const server = import.meta.env.VITE_SERVER

export const store = configureStore({
    reducer:{},
});
