// lib/arvan-storage.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: `https://${process.env.NEXT_PUBLIC_ARVAN_ENDPOINT}`,
  region: 'default',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ARVAN_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_PUBLIC_ARVAN_SECRET_KEY!,
  },
})

export const arvanStorage = {
  async uploadFile(file: File, folder: string = 'uploads') {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_ARVAN_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    })

    await s3Client.send(command)
    
    return {
      url: `${process.env.NEXT_PUBLIC_ARVAN_BASE_URL}/${fileName}`,
      key: fileName
    }
  },

  async deleteFile(fileKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_ARVAN_BUCKET_NAME!,
      Key: fileKey,
    })

    await s3Client.send(command)
  },

  async uploadUserAvatar(userId: string, imageFile: File) {
    return this.uploadFile(imageFile, `users/${userId}/avatar`)
  },

  async uploadMemoryImage(userId: string, imageFile: File) {
    return this.uploadFile(imageFile, `users/${userId}/memories`)
  }
}