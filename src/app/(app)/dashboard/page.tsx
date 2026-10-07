'use client'
import { Message } from '@/models/user.model'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { ApiResponse } from '@/types/apiResponse'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id.toString() !== messageId)
    )
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema)
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessages = useCallback(async () => {
    setIsloading(true)

    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError=error as axiosError<ApiResponse>
    }
  }, [setValue])
  return (
    <div>

    </div>
  )
}

export default page
