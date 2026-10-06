'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@components/ui/form'

import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

const page = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckigUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()
    const deBounced = useDebounceCallback(setUsername, 300)

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
            if (username) {
                setIsCheckigUsername(true)
                setUsernameMessage('')

                try {
                    const response = await axios.get(`/api/checkUsernameUniques?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username "
                    )
                } finally {
                    setIsCheckigUsername(false)
                }
            }
        }
        checkUserNameUnique()
    }, [username])


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast.success('Success', {
                description: response.data.message,
            })

            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in sign up of user", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message

            toast.error('sign up failed', {
                description: errorMessage,
            })
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'>

                        <FormField
                            name="userName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                deBounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password'
                                            placeholder="Password"
                                            {...field}

                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className='animate-spin' />}
                                    <p className={`text-sm ${usernameMessage ===
                                        "Username is unique you can go for this username" ? 'text-green-500' : 'text-red-500'}`}>
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" isDisabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : (
                                'Sign up'
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page