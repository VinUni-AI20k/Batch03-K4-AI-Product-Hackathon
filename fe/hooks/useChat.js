'use client'

import { useCallback, useState } from 'react'
import { sendChatMessage } from '../services/api'

export function useChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (message, context = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await sendChatMessage({ message, context })
      setMessages(current => [
        ...current,
        { role: 'user', content: message },
        { role: 'assistant', ...response, content: response.answer },
      ])
      return response
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { messages, isLoading, error, sendMessage }
}
