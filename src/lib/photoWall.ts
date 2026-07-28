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
    <form class="wall-upload" id="wall-upload">
      <label class="wall-field">
        <span>Your name</span>
        <input type="text" name="name" maxlength="40" placeholder="Guest" autocomplete="nickname" />
      </label>
      <label class="wall-field">
        <span>Caption (optional)</span>
        <input type="text" name="caption" maxlength="80" placeholder="Best day ever!" />
      </label>
      <label class="wall-file">
        <span>Choose a photo</span>
        <input type="file" name="photo" accept="image/*" capture="environment" required />
      </label>
      <button class="action-button" type="submit">Add to the wall</button>
      <p class="wall-status" id="wall-status" aria-live="polite"></p>
    </form>
    <div class="wall-grid" id="wall-grid" aria-live="polite">
      <p class="wall-empty">Loading the wall…</p>
    </div>
    <div class="lightbox" id="lightbox" hidden>
      <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close">×</button>
      <img class="lightbox-img" id="lightbox-img" alt="" />
      <div class="lightbox-meta">
        <p class="lightbox-name" id="lightbox-name"></p>
        <p class="lightbox-caption" id="lightbox-caption"></p>
        <p class="lightbox-time" id="lightbox-time"></p>
        <button type="button" class="action-button action-button-secondary" id="lightbox-delete" hidden>Remove my photo</button>
      </div>
    </div>
  `

  const form = root.querySelector<HTMLFormElement>('#wall-upload')!
  const status = root.querySelector<HTMLElement>('#wall-status')!
  const grid = root.querySelector<HTMLElement>('#wall-grid')!
  const lightbox = root.querySelector<HTMLElement>('#lightbox')!
  const lightboxImg = root.querySelector<HTMLImageElement>('#lightbox-img')!
  const lightboxName = root.querySelector<HTMLElement>('#lightbox-name')!
  const lightboxCaption = root.querySelector<HTMLElement>('#lightbox-caption')!
  const lightboxTime = root.querySelector<HTMLElement>('#lightbox-time')!
  const lightboxDelete = root.querySelector<HTMLButtonElement>('#lightbox-delete')!
  const lightboxClose = root.querySelector<HTMLButtonElement>('#lightbox-close')!

  let photos: WallPhoto[] = []
  let selected: WallPhoto | null = null

  const closeLightbox = () => {
    selected = null
    lightbox.hidden = true
    document.body.style.overflow = ''
  }

  const openLightbox = (photo: WallPhoto) => {
    selected = photo
    lightboxImg.src = photo.url
    lightboxImg.alt = photo.caption || `Photo from ${photo.name}`
    lightboxName.textContent = photo.name
    lightboxCaption.textContent = photo.caption
    lightboxTime.textContent = formatTime(photo.createdAt)
    lightboxDelete.hidden = !getMyPhotoIds().includes(photo.id)
    lightbox.hidden = false
    document.body.style.overflow = 'hidden'
  }

  const renderGrid = () => {
    const mine = new Set(getMyPhotoIds())
    if (photos.length === 0) {
      grid.innerHTML = `<p class="wall-empty">No photos yet — be the first to post!</p>`
      return
    }

    grid.innerHTML = photos
      .map((photo) => {
        const isMine = mine.has(photo.id)
        return `
          <button
            type="button"
            class="gallery-card ${isMine ? 'gallery-card-mine' : ''}"
            data-id="${photo.id}"
            style="--tilt: ${tiltFor(photo.id)}deg"
          >
            <span class="gallery-card-frame">
              <img src="${photo.url}" alt="" loading="lazy" />
              <span class="gallery-card-caption">
                <strong>${escapeHtml(photo.name)}${isMine ? ' · you' : ''}</strong>
                <span>${escapeHtml(photo.caption || 'Party vibes')}</span>
              </span>
            </span>
          </button>
        `
      })
      .join('')

    grid.querySelectorAll<HTMLButtonElement>('.gallery-card').forEach((card) => {
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const file = data.get('photo')
    if (!(file instanceof File) || !file.size) {
      status.textContent = 'Pick a photo first'
      return
    }

    const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement
    submit.disabled = true
    status.textContent = 'Uploading…'

    try {
      await uploadWallPhoto({
        file,
        name: String(data.get('name') || ''),
        caption: String(data.get('caption') || ''),
      })
      form.reset()
      status.textContent = 'Posted — thanks!'
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Upload failed'
    } finally {
      submit.disabled = false
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
