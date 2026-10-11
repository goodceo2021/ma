/**
 * IndexedDB storage utility for storing user-uploaded media (photos & videos)
 * Prevents LocalStorage QuotaExceededError when storing large files.
 */

const DB_NAME = 'ma_media_store_db';
const STORE_NAME = 'media_files';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export interface StoredMedia {
  id: string;
  dataUrl: string;
  mediaType: 'image' | 'video';
  mimeType: string;
  fileName?: string;
  sizeBytes: number;
  timestamp: number;
}

export async function saveMediaToDB(media: StoredMedia): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(media);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback active:', err);
  }
}

export async function getMediaFromDB(id: string): Promise<StoredMedia | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to get from IndexedDB:', err);
    return null;
  }
}

export async function deleteMediaFromDB(id: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete from IndexedDB:', err);
  }
}

/**
 * Convert file to base64 DataURL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Handle user file upload (photo or video), save to IndexedDB and return DataURL + type
 */
export async function storeMediaFile(
  id: string,
  file: File
): Promise<{ mediaUrl: string; mediaType: 'image' | 'video'; fileName: string }> {
  const isVideo = file.type.startsWith('video/');
  const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';
  const dataUrl = await fileToDataUrl(file);

  const stored: StoredMedia = {
    id,
    dataUrl,
    mediaType,
    mimeType: file.type,
    fileName: file.name,
    sizeBytes: file.size,
    timestamp: Date.now(),
  };

  await saveMediaToDB(stored);

  return {
    mediaUrl: dataUrl,
    mediaType,
    fileName: file.name,
  };
}
