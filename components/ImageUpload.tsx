// components/ImageUpload.tsx - Updated with better feedback
'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { arvanStorage } from '../lib/arvan-storage'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  folder?: string
  label?: string
}

export default function ImageUpload({ 
  onUploadComplete, 
  folder = 'memories',
  label = 'Upload Image' 
}: ImageUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is more than 5m!')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please just upload IMAGE')
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setUploading(true)
    setUploadProgress(0)
    
    try {
      let result
      if (folder === 'avatar') {
        result = await arvanStorage.uploadUserAvatar(user.id, file)
      } else {
        result = await arvanStorage.uploadMemoryImage(user.id, file)
      }
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => setUploadProgress(i), i * 20)
      }
      
      setTimeout(() => {
        onUploadComplete(result.url)
        setUploading(false)
        setUploadProgress(0)
      }, 1000)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error in uploading')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex justify-center items-center space-x-4">
        {previewUrl && (
          <div className="relative">
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                <div className="text-white text-xs">{uploadProgress}%</div>
              </div>
            )}
          </div>
        )}
        
        <label className={`cursor-pointer bg-blue-600 text-black font-black px-4 py-2 rounded hover:bg-blue-700 ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            type="file"
            accept="image/*"  
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}