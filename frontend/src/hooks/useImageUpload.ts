import { useState } from 'react';
import { isAxiosError } from 'axios';
import api from '@/lib/axios';

interface UseImageUploadReturn {
	uploadImage: (file: File) => Promise<string | null>;
	uploading: boolean;
	error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
	const [uploading, setUploading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const uploadImage = async (file: File): Promise<string | null> => {
		try {
			setUploading(true);
			setError(null);

			const formData = new FormData();
			formData.append('image', file);

			const response = await api.post<{ url: string }>('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return response.data.url;
		} catch (err: unknown) {
			console.error('Upload error:', err);

			let errorMessage = 'Nie udało się przesłać obrazka';

			if (isAxiosError(err)) {
				errorMessage = err.response?.data?.error || errorMessage;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
			return null;
		} finally {
			setUploading(false);
		}
	};

	return {
		uploadImage,
		uploading,
		error,
	};
}
