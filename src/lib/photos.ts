import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { signInAnonymously } from 'firebase/auth'
import { getFirebase } from './firebase'

export interface WallPhoto {
  id: string
  url: string
  storagePath: string
  name: string
  caption: string
  createdAt: Date
  uid: string
}

const MINE_KEY = 'saras-bday-my-photos'

function toDate(value: unknown): Date {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate()
  }
  if (value instanceof Date) return value
  return new Date()
}

function extensionFor(file: File): string {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  if (file.type === 'image/gif') return 'gif'
  return 'jpg'
}

export function getMyPhotoIds(): string[] {
  try {
    const raw = localStorage.getItem(MINE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function rememberMyPhoto(id: string) {
  const ids = new Set(getMyPhotoIds())
  ids.add(id)
  localStorage.setItem(MINE_KEY, JSON.stringify([...ids]))
}

function forgetMyPhoto(id: string) {
  const ids = getMyPhotoIds().filter((photoId) => photoId !== id)
  localStorage.setItem(MINE_KEY, JSON.stringify(ids))
}

export async function ensureAnonymousAuth(): Promise<string> {
  const { auth } = getFirebase()
  if (auth.currentUser) return auth.currentUser.uid
  const credential = await signInAnonymously(auth)
  return credential.user.uid
}

export function subscribeToPhotos(
  onUpdate: (photos: WallPhoto[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const { db } = getFirebase()
  const photosQuery = query(collection(db, 'photos'), orderBy('createdAt', 'desc'))

  return onSnapshot(
    photosQuery,
    (snapshot) => {
      const photos = snapshot.docs.map((snap) => {
        const data = snap.data()
        return {
          id: snap.id,
          url: data.url as string,
          storagePath: data.storagePath as string,
          name: (data.name as string) || 'Guest',
          caption: (data.caption as string) || '',
          createdAt: toDate(data.createdAt),
          uid: (data.uid as string) || '',
        }
      })
      onUpdate(photos)
    },
    (err) => onError?.(err),
  )
}

export async function uploadWallPhoto(input: { file: File }): Promise<WallPhoto> {
  const uid = await ensureAnonymousAuth()
  const { db, storage } = getFirebase()

  if (!input.file.type.startsWith('image/')) {
    throw new Error('Please choose an image file')
  }
  if (input.file.size > 8 * 1024 * 1024) {
    throw new Error('Keep photos under 8MB')
  }

  const id = crypto.randomUUID()
  const storagePath = `photos/${uid}/${id}.${extensionFor(input.file)}`
  const storageRef = ref(storage, storagePath)
  await uploadBytes(storageRef, input.file)
  const url = await getDownloadURL(storageRef)

  const docRef = await addDoc(collection(db, 'photos'), {
    url,
    storagePath,
    name: 'Guest',
    caption: '',
    uid,
    createdAt: serverTimestamp(),
  })

  rememberMyPhoto(docRef.id)

  return {
    id: docRef.id,
    url,
    storagePath,
    name: 'Guest',
    caption: '',
    createdAt: new Date(),
    uid,
  }
}

export async function deleteWallPhoto(photo: WallPhoto): Promise<void> {
  await ensureAnonymousAuth()
  const { db, storage } = getFirebase()
  await deleteObject(ref(storage, photo.storagePath))
  await deleteDoc(doc(db, 'photos', photo.id))
  forgetMyPhoto(photo.id)
}
