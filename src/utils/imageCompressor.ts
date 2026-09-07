/**
 * Utility to resize and compress images on the client side
 * Prevents Firestore document size limit (> 1MB) errors and speeds up mobile loading.
 */

export async function compressImageFile(
  file: File | Blob,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo de imagem'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }
      compressDataUrl(src, maxWidth, maxHeight, quality)
        .then(resolve)
        .catch(() => resolve(src)); // Fallback
    };
    reader.readAsDataURL(file);
  });
}

export async function compressDataUrl(
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.75
): Promise<string> {
  // If it's already an external HTTP/HTTPS URL, no need to compress
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
    return dataUrl;
  }

  // If it's a small data URL (< 100KB), return as is
  if (dataUrl.length < 100 * 1024) {
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
 */
export async function optimizeVehiclePhotos(photos: string[]): Promise<string[]> {
  if (!photos || photos.length === 0) return [];

  const optimized = await Promise.all(
    photos.map(async (photo) => {
      if (photo.startsWith('data:image/')) {
        try {
          return await compressDataUrl(photo, 1200, 850, 0.72);
        } catch {
          return photo;
        }
      }
      return photo;
    })
  );

  return optimized;
}
