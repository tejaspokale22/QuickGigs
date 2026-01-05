'use client'

import React, { useRef, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

interface QRCodeUploadProps {
  onUpload: (file: File) => Promise<void>
  currentQRUrl?: string
  isLoading?: boolean
}

export default function QRCodeUpload({
  onUpload,
  currentQRUrl,
  isLoading = false,
}: QRCodeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentQRUrl || null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setPreview(result)

        // Upload file
        setUploading(true)
        try {
          await onUpload(file)
          toast.success('QR code uploaded successfully!')
        } catch (error) {
          toast.error('Failed to upload QR code')
          console.error('Upload error:', error)
        } finally {
          setUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Error processing file')
      console.error('File processing error:', error)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">UPI QR Code</Label>

      {preview ? (
        <div className="relative w-full max-w-xs mx-auto">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
            <Image
              src={preview}
              alt="QR Code Preview"
              fill
              className="object-contain p-4"
              onError={() => toast.error('Failed to load preview')}
            />
          </div>
          <button
            onClick={handleRemove}
            disabled={uploading || isLoading}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
            aria-label="Remove QR code"
          >
            <X className="w-4 h-4" />
          </button>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || isLoading}
            variant="outline"
            className="w-full mt-3"
          >
            Change QR Code
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-gray-700 bg-gray-100'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          } ${uploading || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            {uploading || isLoading ? (
              <>
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-medium">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={uploading || isLoading}
            className="hidden"
            aria-label="Upload QR code"
          />
        </div>
      )}
    </div>
  )
}
