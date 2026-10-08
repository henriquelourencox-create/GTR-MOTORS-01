/**
 * Utility to resize, compress and persist images
 * Prevents Firestore document size limit (> 1MB) errors and speeds up mobile loading.
 */

export async function uploadPhotoToServer(dataUrl: string): Promise<string | null> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;

  try {
    const res = await fetch('/api/upload-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (e) {
    console.warn('Upload de foto para servidor local indisponível, usando fallback comprimido:', e);
  }
  return null;
}

export async function compressImageFile(
  file: File | Blob,
  maxWidth = 960,
  maxHeight = 720,
  quality = 0.65
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem'));
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }

      // First compress to small canvas
      const compressed = await compressDataUrl(src, maxWidth, maxHeight, quality);

      // Attempt to save to disk via /api/upload-photo to keep Firestore document tiny (<2KB)
      const uploadedUrl = await uploadPhotoToServer(compressed);
      if (uploadedUrl) {
        resolve(uploadedUrl);
        return;
      }

      resolve(compressed);
    };
    reader.readAsDataURL(file);
  });
}

export async function compressDataUrl(
  dataUrl: string,
  maxWidth = 960,
  maxHeight = 720,
  quality = 0.65
): Promise<string> {
  // If it's already an external HTTP/HTTPS URL or /uploads/ path, return as is
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/uploads/')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;

      // Calculate aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Draw and compress as JPEG
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);

      // If compressed is smaller, use it; otherwise fallback
      resolve(compressed.length < dataUrl.length ? compressed : dataUrl);
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Optimizes an array of vehicle photos before saving to database
 * Converts base64 to server upload URLs or compressed compact data URLs.
 */
export async function optimizeVehiclePhotos(photos: string[]): Promise<string[]> {
  if (!photos || photos.length === 0) return [];

  const optimized = await Promise.all(
    photos.map(async (photo) => {
      if (photo.startsWith('data:image/')) {
        try {
          // 1. Try uploading to local server first
          const uploadedUrl = await uploadPhotoToServer(photo);
          if (uploadedUrl) return uploadedUrl;

          // 2. Fallback to compact compression (max 960x720, quality 0.62)
          return await compressDataUrl(photo, 960, 720, 0.62);
        } catch {
          return photo;
        }
      }
      return photo;
    })
  );

  return optimized;
}
