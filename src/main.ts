import './style.css'
import { setupPhotoWall } from './lib/photoWall'

const base = import.meta.env.BASE_URL

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
  {
    q: 'Who always pulls the football away from Charlie Brown?',
    choices: ['Peppermint Patty', 'Sally', 'Lucy', 'Marcie'],
    answer: 2,
  },
  {
    q: 'What instrument does Schroeder play?',
    choices: ['Guitar', 'Drums', 'Violin', 'Piano'],
    answer: 3,
  },
  {
    q: 'What does Linus never leave home without?',
    choices: ['His blanket', 'His lunchbox', 'His kite', 'His baseball glove'],
    answer: 0,
  },
  {
    q: 'What is Peppermint Patty’s real first name?',
    choices: ['Patricia', 'Pamela', 'Penny', 'Paula'],
    answer: 0,
  },
  {
    q: 'In “A Charlie Brown Christmas,” what does Charlie Brown want instead of a fancy aluminum tree?',
    choices: ['A plastic palm', 'A big shiny star', 'A real little tree', 'No tree at all'],
    answer: 2,
  },
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
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
          <picture>
            <source srcset="${base}images/snoopy-dance.webp" type="image/webp" />
            <img
              class="snoopy-dance"
              src="${base}images/snoopy-dance.gif"
              alt="Snoopy and Woodstock dancing in party hats"
              width="370"
              height="296"
            />
          </picture>
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

    <section class="trivia-section" aria-labelledby="trivia-title">
      <h2 id="trivia-title">Peanuts<br><em>trivia.</em></h2>
      <p class="section-lede">Ten questions. No psychiatric help required (unless you want it for a nickel).</p>
      <div class="trivia-board" id="trivia-board"></div>
    </section>

    <section class="playlist" aria-labelledby="playlist-title">
      <div class="playlist-inner">
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

    <section class="photo-wall-section" aria-labelledby="photo-wall-title">
      <h2 id="photo-wall-title">The photo<br><em>wall.</em></h2>
      <p class="section-lede">Add a pic from your camera or camera roll.</p>
      <div id="photo-wall"></div>
    </section>
  </main>
`

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
setupPhotoWall()
