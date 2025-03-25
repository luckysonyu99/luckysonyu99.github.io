'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number;
}

export default function FileUpload({ 
  onUploadComplete, 
  accept = 'image/*,video/*',
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > maxSize) {
      setError(`文件大小不能超过 ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 上传文件
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      onUploadComplete(data.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-2 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">点击上传</span> 或拖拽文件到这里
            </p>
            <p className="text-xs text-gray-500">
              {accept === 'image/*,video/*' ? '支持图片和视频' : '支持图片'}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {preview && (
        <div className="relative w-full h-48">
          <Image
            src={preview}
            alt="预览"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {uploading && (
        <div className="text-gray-500 text-sm">上传中...</div>
      )}
    </div>
  );
} 