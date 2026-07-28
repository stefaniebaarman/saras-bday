import { isFirebaseConfigured } from './firebase'
import {
  deleteWallPhoto,
  ensureAnonymousAuth,
  getMyPhotoIds,
  subscribeToPhotos,
  uploadWallPhoto,
  type WallPhoto,
} from './photos'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function tiltFor(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i) * (i + 1)) % 11
  return hash - 5
}

function formatTime(date: Date): string {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function setupPhotoWall() {
  const root = document.querySelector<HTMLElement>('#photo-wall')
  if (!root) return

  if (!isFirebaseConfigured()) {
    root.innerHTML = `
      <div class="wall-setup">
        <p><strong>Photo wall is ready in the code</strong> — Firebase still needs to be connected.</p>
        <p>Follow the setup steps in <code>PHOTO_WALL.md</code>, then refresh.</p>
      </div>
    `
    return
  }

  root.innerHTML = `
    <input
      type="file"
      id="wall-file"
      class="wall-file-input"
      accept="image/*"
      capture="environment"
      aria-hidden="true"
      tabindex="-1"
    />
    <p class="wall-status" id="wall-status" aria-live="polite"></p>
    <div class="wall-grid" id="wall-grid" aria-live="polite">
      <p class="wall-empty">Loading the wall…</p>
    </div>
    <div class="lightbox" id="lightbox" hidden>
      <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close">×</button>
      <img class="lightbox-img" id="lightbox-img" alt="" />
      <div class="lightbox-meta">
        <p class="lightbox-time" id="lightbox-time"></p>
        <button type="button" class="action-button action-button-secondary" id="lightbox-delete" hidden>Remove my photo</button>
      </div>
    </div>
  `

  const fileInput = root.querySelector<HTMLInputElement>('#wall-file')!
  const status = root.querySelector<HTMLElement>('#wall-status')!
  const grid = root.querySelector<HTMLElement>('#wall-grid')!
  const lightbox = root.querySelector<HTMLElement>('#lightbox')!
  const lightboxImg = root.querySelector<HTMLImageElement>('#lightbox-img')!
  const lightboxTime = root.querySelector<HTMLElement>('#lightbox-time')!
  const lightboxDelete = root.querySelector<HTMLButtonElement>('#lightbox-delete')!
  const lightboxClose = root.querySelector<HTMLButtonElement>('#lightbox-close')!

  let photos: WallPhoto[] = []
  let selected: WallPhoto | null = null
  let uploading = false

  const closeLightbox = () => {
    selected = null
    lightbox.hidden = true
    document.body.style.overflow = ''
  }

  const openLightbox = (photo: WallPhoto) => {
    selected = photo
    lightboxImg.src = photo.url
    lightboxImg.alt = 'Party photo'
    lightboxTime.textContent = formatTime(photo.createdAt)
    lightboxDelete.hidden = !getMyPhotoIds().includes(photo.id)
    lightbox.hidden = false
    document.body.style.overflow = 'hidden'
  }

  const openPicker = () => {
    if (uploading) return
    fileInput.click()
  }

  const renderGrid = () => {
    const mine = new Set(getMyPhotoIds())
    const addCard = `
      <button
        type="button"
        class="gallery-card gallery-card-add ${uploading ? 'is-uploading' : ''}"
        id="wall-add"
        style="--tilt: -3deg"
        ${uploading ? 'disabled' : ''}
      >
        <span class="gallery-card-frame add-frame">
          <span class="add-camera" aria-hidden="true">
            <span class="add-plus">+</span>
          </span>
          <span class="add-copy">
            <strong>${uploading ? 'Uploading…' : 'Tap to add a pic'}</strong>
            <span>${uploading ? 'Hang tight!' : 'Camera or camera roll'}</span>
          </span>
        </span>
      </button>
    `

    const photoCards = photos
      .map((photo) => {
        const isMine = mine.has(photo.id)
        return `
          <button
            type="button"
            class="gallery-card ${isMine ? 'gallery-card-mine' : ''}"
            data-id="${photo.id}"
            style="--tilt: ${tiltFor(photo.id)}deg"
            aria-label="Open party photo"
          >
            <span class="gallery-card-frame">
              <img src="${photo.url}" alt="" loading="lazy" />
            </span>
          </button>
        `
      })
      .join('')

    grid.innerHTML = addCard + photoCards
    grid.querySelector('#wall-add')?.addEventListener('click', openPicker)

    grid.querySelectorAll<HTMLButtonElement>('.gallery-card[data-id]').forEach((card) => {
      card.addEventListener('click', () => {
        const photo = photos.find((item) => item.id === card.dataset.id)
        if (photo) openLightbox(photo)
      })
    })
  }

  ensureAnonymousAuth().catch((error) => {
    status.textContent = error instanceof Error ? error.message : 'Could not connect'
  })

  subscribeToPhotos(
    (next) => {
      photos = next
      renderGrid()
    },
    (error) => {
      grid.innerHTML = `<p class="wall-empty">Couldn’t load photos: ${escapeHtml(error.message)}</p>`
    },
  )

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0]
    fileInput.value = ''
    if (!file) return

    uploading = true
    status.textContent = ''
    renderGrid()

    try {
      await uploadWallPhoto({ file })
      status.textContent = 'Cute! It’s on the wall.'
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Upload failed'
    } finally {
      uploading = false
      renderGrid()
    }
  })

  lightboxClose.addEventListener('click', closeLightbox)
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox()
  })

  lightboxDelete.addEventListener('click', async () => {
    if (!selected) return
    lightboxDelete.disabled = true
    try {
      await deleteWallPhoto(selected)
      closeLightbox()
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Could not delete photo'
    } finally {
      lightboxDelete.disabled = false
    }
  })
}
