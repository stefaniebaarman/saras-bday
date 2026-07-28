import './style.css'

const base = import.meta.env.BASE_URL

/**
 * Edit these when party facts or night-of status change.
 * crewStatus examples:
 * - "At pregame — come on over!"
 * - "Heading to the bars — check the group chat"
 * - "Still celebrating — join us!"
 */
const party = {
  title: "Sara & Stefanie's Birthday",
  dateLabel: 'Saturday, August 1, 2026',
  timeLabel: '5:00 PM ET',
  address: '2100 11th St NW',
  city: 'Washington, DC',
  dressCode: 'Peanuts / Snoopy fits',
  /** Local wall time in Eastern Daylight Time */
  startIso: '2026-08-01T17:00:00-04:00',
  endIso: '2026-08-02T01:00:00-04:00',
  crewStatus: 'Pregame starts Saturday at 5 — see you there!',
  dedicationsUrl: '', // paste a Google Form URL when ready
}

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${party.address}, ${party.city}`)}`

function toGCalStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: party.title,
    dates: `${toGCalStamp(party.startIso)}/${toGCalStamp(party.endIso)}`,
    details: `${party.dressCode}. Pregame playlist on the party site.`,
    location: `${party.address}, ${party.city}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const trivia = [
  {
    q: 'What kind of dog is Snoopy?',
    choices: ['Beagle', 'Poodle', 'Dalmatian', 'Terrier'],
    answer: 0,
  },
  {
    q: 'Who is Snoopy’s best bird friend?',
    choices: ['Tweety', 'Woodstock', 'Big Bird', 'Duckie'],
    answer: 1,
  },
  {
    q: 'What color is Charlie Brown’s shirt?',
    choices: ['Solid blue', 'Yellow with a black zigzag', 'Red stripes', 'Green polka dots'],
    answer: 1,
  },
  {
    q: 'What does Lucy usually charge for psychiatric help?',
    choices: ['A nickel', 'A dime', 'A quarter', 'Free'],
    answer: 0,
  },
  {
    q: 'What is Snoopy’s cool alter ego called?',
    choices: ['Cool Dog', 'Joe Cool', 'Ace Beagle', 'Mr. Smooth'],
    answer: 1,
  },
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <div class="crew-banner" role="status">
      <span class="crew-label">Where’s the crew?</span>
      <span class="crew-status">${party.crewStatus}</span>
    </div>

    <section class="hero" aria-labelledby="party-title">
      <div class="sunburst" aria-hidden="true"></div>
      <div class="cloud cloud-one" aria-hidden="true"></div>
      <div class="cloud cloud-two" aria-hidden="true"></div>

      <div class="hero-content">
        <div class="intro">
          <h1 id="party-title">
            Good grief,<br>
            <span>we’re celebrating!</span>
          </h1>
          <p class="lede">Come party with us as Sara turns <strong>30</strong> and Stefanie turns <strong>28</strong> — Peanuts style.</p>

          <div class="birthday-badges" aria-label="Birthday ages">
            <div class="badge badge-red">
              <span class="badge-number">30</span>
              <span>Sara</span>
            </div>
            <div class="badge-plus">+</div>
            <div class="badge badge-blue">
              <span class="badge-number">28</span>
              <span>Stefanie</span>
            </div>
          </div>
        </div>

        <div class="art-wrap">
          <div class="speech-bubble">Best day ever!</div>
          <img
            class="woodstock"
            src="${base}images/woodstock-clean.png"
            alt="Woodstock"
            width="140"
            height="150"
          />
          <img
            class="snoopy"
            src="${base}images/snoopy-heart-clean.png"
            alt="Snoopy hugging a big red heart"
            width="520"
            height="600"
          />
          <img
            class="snoopy-cool"
            src="${base}images/hero-snoopy.png"
            alt="Joe Cool Snoopy"
            width="220"
            height="300"
          />
          <div class="ground-line" aria-hidden="true"></div>
        </div>
      </div>

      <div class="ticker" aria-label="Party highlights">
        <div class="ticker-track">
          <span>Cake!</span><i>★</i><span>Dancing!</span><i>★</i><span>Add a song!</span><i>★</i>
          <span>Aug 1 · 5pm</span><i>★</i><span>Cake!</span><i>★</i><span>Dancing!</span><i>★</i>
          <span>Add a song!</span><i>★</i><span>Aug 1 · 5pm</span><i>★</i>
        </div>
      </div>
    </section>

    <section class="details" aria-labelledby="details-title">
      <p class="kicker">The when &amp; where</p>
      <h2 id="details-title">Party details<br><em>locked in.</em></h2>
      <ul class="detail-list">
        <li>
          <span class="detail-label">When</span>
          <span>${party.dateLabel}<br>${party.timeLabel}</span>
        </li>
        <li>
          <span class="detail-label">Where</span>
          <span>${party.address}<br>${party.city}</span>
        </li>
        <li>
          <span class="detail-label">Dress</span>
          <span>${party.dressCode}</span>
        </li>
      </ul>
      <div class="detail-actions">
        <a class="action-button" href="${googleCalendarUrl()}" target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
        <a class="action-button action-button-secondary" href="${base}party.ics">Download .ics</a>
        <a class="action-button action-button-secondary" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Open in Maps</a>
      </div>
      <div class="countdown" id="countdown" aria-live="polite">
        <p class="countdown-label">Pregame starts in</p>
        <div class="countdown-grid">
          <div><strong id="cd-days">0</strong><span>days</span></div>
          <div><strong id="cd-hours">0</strong><span>hours</span></div>
          <div><strong id="cd-mins">0</strong><span>mins</span></div>
          <div><strong id="cd-secs">0</strong><span>secs</span></div>
        </div>
      </div>
    </section>

    <section class="playlist" aria-labelledby="playlist-title">
      <div class="playlist-inner">
        <p class="kicker">Pregame soundtrack</p>
        <h2 id="playlist-title">Add a song<br><em>to the playlist.</em></h2>
        <p>We’re building the pregame vibes together. Drop your favorite tracks so the party starts off right.</p>
        <a
          class="spotify-button"
          href="https://open.spotify.com/playlist/2J4iFLXtZl7C4YokRLLuUs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="spotify-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.96-.12-1.08-.6-.12-.48.12-.96.6-1.08 4.38-1.32 9.76-.66 13.44 1.62.36.18.54.78.24 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72.96.42 1.44-.3.42-.96.6-1.44.3z"/>
          </svg>
          <span>Open Spotify playlist</span>
        </a>
        <iframe
          class="spotify-embed"
          title="Pregame Spotify playlist"
          src="https://open.spotify.com/embed/playlist/2J4iFLXtZl7C4YokRLLuUs?utm_source=generator"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
      </div>
    </section>

    <section class="costumes" aria-labelledby="costumes-title">
      <p class="kicker">Dress the part</p>
      <h2 id="costumes-title">Costume<br><em>inspiration.</em></h2>
      <p class="section-lede">Channel your favorite Peanuts character — no perfection required, just vibes.</p>
      <div class="costume-grid">
        <article class="costume-card costume-snoopy">
          <h3>Snoopy</h3>
          <p>White + black, floppy ears energy, red collar, or full Joe Cool shades.</p>
        </article>
        <article class="costume-card costume-woodstock">
          <h3>Woodstock</h3>
          <p>Sunny yellow, spiky hair, tiny but mighty best-friend energy.</p>
        </article>
        <article class="costume-card costume-charlie">
          <h3>Charlie Brown</h3>
          <p>Yellow tee with a black zigzag. Optional: a little good-grief sigh.</p>
        </article>
        <article class="costume-card costume-lucy">
          <h3>Lucy</h3>
          <p>Blue dress vibes, bold opinions, psychiatric booth optional.</p>
        </article>
        <article class="costume-card costume-patty">
          <h3>Peppermint Patty</h3>
          <p>Sandals, green shirt, freckles, and championship confidence.</p>
        </article>
      </div>
    </section>

    <section class="dedications" aria-labelledby="dedications-title">
      <p class="kicker">Raise a glass</p>
      <h2 id="dedications-title">Leave Sara &amp; Stefanie<br><em>a toast.</em></h2>
      <p class="section-lede">A short note, a silly memory, or a birthday wish — we’ll save them for the night.</p>
      ${
        party.dedicationsUrl
          ? `<a class="action-button" href="${party.dedicationsUrl}" target="_blank" rel="noopener noreferrer">Leave a toast</a>`
          : `<p class="coming-note">Toast form coming soon — check back!</p>`
      }
    </section>

    <section class="trivia-section" aria-labelledby="trivia-title">
      <p class="kicker">Warm-up game</p>
      <h2 id="trivia-title">Peanuts<br><em>trivia.</em></h2>
      <p class="section-lede">Five questions. No psychiatric help required (unless you want it for a nickel).</p>
      <div class="trivia-board" id="trivia-board"></div>
    </section>
  </main>
`

function updateCountdown() {
  const root = document.querySelector('#countdown')
  if (!root) return

  const start = new Date(party.startIso).getTime()
  const now = Date.now()
  const diff = start - now

  if (diff <= 0) {
    root.innerHTML = `<p class="countdown-live">It’s party time — see you at pregame!</p>`
    return
  }

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  const secs = Math.floor((diff % 60_000) / 1000)

  const set = (id: string, value: number) => {
    const el = document.getElementById(id)
    if (el) el.textContent = String(value)
  }
  set('cd-days', days)
  set('cd-hours', hours)
  set('cd-mins', mins)
  set('cd-secs', secs)
}

updateCountdown()
window.setInterval(updateCountdown, 1000)

function renderTrivia() {
  const board = document.querySelector<HTMLElement>('#trivia-board')
  if (!board) return

  let index = 0
  let score = 0

  const paint = () => {
    if (index >= trivia.length) {
      const line =
        score === trivia.length
          ? 'You’re a blockhead genius!'
          : score >= 3
            ? 'Not bad — Snoopy approves.'
            : 'Good grief! Play again?'
      board.innerHTML = `
        <div class="trivia-result">
          <p class="trivia-score">You got <strong>${score}/${trivia.length}</strong></p>
          <p>${line}</p>
          <button type="button" class="action-button" id="trivia-restart">Play again</button>
        </div>
      `
      document.querySelector('#trivia-restart')?.addEventListener('click', () => {
        index = 0
        score = 0
        paint()
      })
      return
    }

    const item = trivia[index]
    board.innerHTML = `
      <p class="trivia-progress">Question ${index + 1} of ${trivia.length}</p>
      <h3 class="trivia-question">${item.q}</h3>
      <div class="trivia-choices">
        ${item.choices
          .map(
            (choice, choiceIndex) =>
              `<button type="button" class="trivia-choice" data-index="${choiceIndex}">${choice}</button>`,
          )
          .join('')}
      </div>
    `

    board.querySelectorAll<HTMLButtonElement>('.trivia-choice').forEach((button) => {
      button.addEventListener('click', () => {
        const selected = Number(button.dataset.index)
        const correct = selected === item.answer
        if (correct) score += 1
        board.querySelectorAll<HTMLButtonElement>('.trivia-choice').forEach((b) => {
          b.disabled = true
          const i = Number(b.dataset.index)
          if (i === item.answer) b.classList.add('is-correct')
          if (i === selected && !correct) b.classList.add('is-wrong')
        })
        window.setTimeout(() => {
          index += 1
          paint()
        }, 700)
      })
    })
  }

  paint()
}

renderTrivia()
