/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import ImageUpload from '../../../components/ImageUpload'

interface Memory {
  id: string
  image_url: string
  title?: string
  description?: string
  created_at: string
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loadingMemories, setLoadingMemories] = useState(true)

  // Load user's memories from database
  useEffect(() => {
    if (user) {
      loadMemories()
      loadUserProfile()
    }
  })

  const loadMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMemories(data || [])
    } catch (error) {
      console.error('Error loading memories:', error)
    } finally {
      setLoadingMemories(false)
    }
  }

  const loadUserProfile = async () => {
    if (!user) return
    // Load user's avatar from user_metadata or profiles table
    setAvatarUrl(user.user_metadata?.avatar_url || '')
  }

  const saveMemory = async (imageUrl: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('memories')
        .insert([
          {
            user_id: user.id,
            image_url: imageUrl,
            title: 'new memory',
            description: 'memory descript'
          }
        ])
        .select()

      if (error) throw error
      
      // Refresh memories list
      loadMemories()
      console.log('Memory saved to database:', data)
    } catch (error) {
      console.error('Error saving memory:', error)
      alert('Error in saving file')
    }
  }

  const downloadImage = async(imageUrl : string, memory: Memory) =>{
    try{
      const date = new Date(memory.created_at).toISOString().split('T')[0]
      const cleanTitle = memory.title 
        ? memory.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)
        : 'memory'

      const filename = `momento_${date}_${cleanTitle}.jpg`

      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('Failed to fetch image')

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    } catch (error){
      console.error("download has failed", error)
      alert("there is a problem in downloding the image")
    }

  }


  const handleMemoryImageUpload = async (url: string) => {
    await saveMemory(url)
  }


  const deleteMemory = async (memoryId: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId)

      if (error) throw error
      
      // Refresh memories list
      loadMemories()
    } catch (error) {
      console.error('Error deleting memory:', error)
      alert('Delete Error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/signin'
  }

  return (
    <div className="min-h-screen bg-gray-600 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="fixed top-0 left-0 right-0 bg-blue-300 border-b border-gray-200 z-50 text-black">
          <div className='flex justify-between items-center px-6 py-4 border-b border-gray-100'>
            <h1 className='font-black text-3xl'
            >Momento</h1>
            <button onClick={handleSignOut}
            className='bg-blue-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm'>
            Sign Out
            </button>
          </div>
        </div>
        <div className='fixed top-13 left-0 right-0 bg-blue-300 border-b border-gray-200 z-50 text-black'>
                      <ImageUpload 
              onUploadComplete={handleMemoryImageUpload}
              folder="memories"
              label=""/>
        </div>
        <div className="mt-10 bg-blue-500 p-6 rounded-lg shadow">
          <h2 className="text-xl font-black mb-4 text-center text-black">Your Memories</h2>
          
          {loadingMemories ? (
            <div>Uploading memory...</div>
          ) : memories.length === 0 ? (
            <div className="text-center text-black py-8">
              No memories yet. Upload your first!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memories.map((memory) => (
                <div key={memory.id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={memory.image_url} 
                    alt="Memory" 
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-3">
                    <p className="text-sm text-gray-600">
                      {new Date(memory.created_at).toLocaleDateString('fa-IR')}
                    </p>
                    <div className='flex justify-between items-center'>
                      <button
                      onClick={() => deleteMemory(memory.id)}
                      className="cursor-pointer mt-2 hover:text-red-800"
                    >
                    🗑️
                    </button>
                    <button
                      onClick={() => downloadImage(memory.image_url, memory)}
                      className="cursor-pointer mt-2 hover:text-red-800"
                      title='download this image'
                      >📥
                    </button>
                    </div>
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