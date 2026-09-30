'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import {useToast} from 

const page = () => {
    const [userName, setuserName] = useState('')
    const [userNameMessage, setuserNameMessage] = useState('')
    const [isCheckingUserName, setIsCheckingUserName] = useState(false)
    const [isSubmiting, setIssubmiting] = useState(false)

    const debeounceusername = useDebounceValue(userName, 300)

    return (


        <div>
            page
        </div>
    )
}

export default page
