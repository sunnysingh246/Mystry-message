'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInschema'

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
import { signIn } from 'next-auth/react'
import { totalmem } from 'os'

const page = () => {

    const router = useRouter()
    //zod Implementation
    const form = useForm({
        resolver: zodResolver(signInSchema),

    })



    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error) {
            if (result.error == 'CredentialSignIn') {
                toast.error('Login failed', {
                    description: 'Incorrect username or password',
                })
            }
            else {
                toast.error('Error', {
                    description: result.error,
                })
            }

        }

        if (result?.url) {
            router.replace('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign in to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'>

                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>email/username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email/username "
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit"> sign-in </Button>
                    </form>
                </Form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page