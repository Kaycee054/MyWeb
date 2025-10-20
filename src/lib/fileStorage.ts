import { supabase } from './supabase'

export interface FileUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export interface FileDownloadResult {
  success: boolean
  url?: string
  error?: string
}

export class FileStorageManager {
  private static instance: FileStorageManager
  private readonly BUCKET_NAME = 'documents'
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private readonly ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp']

  static getInstance(): FileStorageManager {
    if (!FileStorageManager.instance) {
      FileStorageManager.instance = new FileStorageManager()
    }
    return FileStorageManager.instance
  }

  private generateFileName(originalName: string, category: string): string {
    const timestamp = Date.now()
    const extension = originalName.split('.').pop()
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `${category}/${timestamp}_${sanitizedName}`
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' }
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'File type not supported' }
    }

    return { valid: true }
  }

  async uploadFile(file: File, category: 'cv' | 'resume' | 'project' | 'experience' = 'cv'): Promise<FileUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.name, category)

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName)

      // Store file reference in database
      const { error: dbError } = await supabase
        .from('cv_uploads')
        .insert({
          filename: file.name,
          file_path: fileName,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        })

      if (dbError) {
        console.warn('Database storage warning:', dbError)
        // Continue anyway - file is uploaded
      }

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName
      }
    } catch (error) {
      console.error('File upload error:', error)
      return { success: false, error: 'Upload failed' }
    }
  }

  async downloadFile(path: string): Promise<FileDownloadResult> {
    try {
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(path)

      return {
        success: true,
        url: data.publicUrl
      }
    } catch (error) {
      console.error('File download error:', error)
      return { success: false, error: 'Download failed' }
    }
  }

  async deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path])

      if (error) {
        return { success: false, error: error.message }
      }

      // Remove from database
      await supabase
        .from('cv_uploads')
        .delete()
        .eq('file_path', path)

      return { success: true }
    } catch (error) {
      console.error('File deletion error:', error)
      return { success: false, error: 'Deletion failed' }
    }
  }

  async listFiles(category?: string): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(category || '', {
          limit: 100,
          offset: 0
        })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, files: data }
    } catch (error) {
      console.error('File listing error:', error)
      return { success: false, error: 'Listing failed' }
    }
  }
}

export const fileStorage = FileStorageManager.getInstance()