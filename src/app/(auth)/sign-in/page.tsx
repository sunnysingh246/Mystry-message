'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'

const router = useRouter()

const Page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckigUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const deBouncedUserName = useDebounceValue(username, 300)
    const router = useRouter()

    //zod Implementation
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            userName: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (deBouncedUserName) {
                setIsCheckigUsername(true)
                setUsernameMessage('')

                try {
                    const response = await axios.get(`/api/checkUsernameUniques?username=${deBouncedUserName}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error chrcking username "
                    )
                } finally {
                    setIsCheckigUsername(false)
                }
            }
        }
        checkUserNameUnique()
    }, [deBouncedUserName])


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in sign up of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message

            toast({
                title: 'sign up failed',
                description: errorMessage,
                variant: "destructive"
            })
            setIsSubmitting(false)
        }
    }

    return (
        <div>page</div>
    )
}


export default Page
