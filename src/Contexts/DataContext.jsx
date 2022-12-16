import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export default function DataContextProvider({ children }) {
    const [completescheduledata, setCompletescheduledata] = useState([])
    const [contextstate, setContextstate] = useState(true)

    useEffect(() => {
        axios(`http://localhost:8000/schedule`)
            .then((res) => {
                setCompletescheduledata(res.data)
                console.log(res.data)
            })
            .catch((err) => console.log(err))
    }, [contextstate])

    const Deletewholeday = (id) => {
        setContextstate(!contextstate);
        axios.delete(`http://localhost:8000/schedule/${id}`)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }

    const Deleteparticularexercise = (id, schedule, parid) => {
        let myExceptionalarr = schedule.filter((el) => {
            return el.key !== parid;
        })

        // console.log("myExceptionalarr" , myExceptionalarr);

        axios.patch(`http://localhost:8000/schedule/${id}`, {
            "schedules": [...myExceptionalarr]
        })
            .then(() => setContextstate(!contextstate))
    }

    const PatchparticularDig = (digit, id, schedule, nameofkey, parid) => {
        //    console.log("digit",digit);
        //    console.log("id",id,"parid",parid,"nameofkey",nameofkey);
        //    console.log("schedule",schedule);

        let particularobj = schedule.filter((item) => {
            return item.key === parid
        })
        particularobj[0][nameofkey] = digit;

        let secondExceptionalArr = schedule.filter((item) => {
            return item.key !== parid
        })
        
        // console.log("particulararr",particularobj);
        // console.log("secondarr",secondExceptionalArr);

        axios.patch(`http://localhost:8000/schedule/${id}`, {
            "schedules": [...particularobj, ...secondExceptionalArr]
        })
            .then(() => setContextstate(!contextstate))

    }

    return (
        <DataContext.Provider value={{ completescheduledata, Deletewholeday, Deleteparticularexercise, setContextstate, contextstate, PatchparticularDig }}>
            {children}
        </DataContext.Provider>)
}