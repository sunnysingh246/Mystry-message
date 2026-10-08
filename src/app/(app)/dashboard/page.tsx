'use client'
import { Message } from '@/models/user.model'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { User } from 'next-auth'

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id.toString() !== messageId)
    )
  }

  const { data: session } = useSession()

  const form = useForm<{ acceptMessages: boolean }>({
    resolver: zodResolver(acceptMessagesSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')
  const profileUrl = session?.user?.username
    ? `${window.location.origin}/u/${session.user.username}`
    : ''

  const copyToClipboard = useCallback(async () => {
    if (!profileUrl) return

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Copied link')
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to copy the link',
      })
    }
  }, [profileUrl])

  const fetchAcceptMessages = useCallback(async () => {
    setIsloading(true)

    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', Boolean(response.data.isAcceptingMessages))
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error', {
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
      })
    } finally {
      setIsloading(false)
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async () => {
    setIsloading(true)

    try {
      const response = await axios.get<ApiResponse>('/api/getMEsseges')
      setMessages(response.data.messages || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error', {
        description: axiosError.response?.data.message || 'Failed to fetch messages',
      })
    } finally {
      setIsloading(false)
    }
  }, [])

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsloading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])

      if (refresh) {
        toast.success('refresh mesages', {
          description: 'showing latest messages',
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error', {
        description: axiosError.response?.data.message || 'Failed to fetch messages',
      })

    } finally {
      setIsSwitchLoading(false)
      setIsloading(false)
    }

  }, [setIsloading, setMessages])

  useEffect(() => {

    if (!session || !session.user) return
    fetchMessage()
    fetchAcceptMessages()
  }, [session, setValue, fetchAcceptMessages, fetchMessage])

  //handle switch change 
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      })

      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message || 'Message settings updated')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to update message settings',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  if (!session || !session.user) {
    return <div>Please Login</div>
  }

  return (
    <div className="mx-auto my-8 max-w-6xl rounded-[28px] bg-background p-6 shadow-2xl ring-1 ring-white/10 md:mx-8 md:px-8 lg:mx-auto lg:p-8">
      <h1 className="mb-6 text-4xl font-bold text-foreground">User Dashboard</h1>

      <div className="mb-8 max-w-2xl rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-2xl font-semibold text-foreground">Copy Your Unique Link</h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none"
          />

          <button
            type="button"
            onClick={() => void copyToClipboard()}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Message settings</h2>
              <p className="text-sm text-muted-foreground">
                Turn incoming messages on or off.
              </p>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(acceptMessages)}
                disabled={isSwitchLoading}
                onChange={() => void handleSwitchChange()}
              />
              <span>{acceptMessages ? 'On' : 'Off'}</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <button
              type="button"
              onClick={() => void fetchMessage(true)}
              disabled={isLoading || isSwitchLoading}
              className="rounded-md border px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message._id.toString()} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm">{message.content}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(message._id.toString())}
                      className="text-xs text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
