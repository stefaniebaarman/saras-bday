import './style.css'

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
          <div class="speech-bubble">Best day ever!</div>
          <img
            class="woodstock"
            src="/images/woodstock-clean.png"
            alt="Woodstock"
            width="140"
            height="150"
          />
          <img
            class="snoopy"
            src="/images/snoopy-heart-clean.png"
            alt="Snoopy hugging a big red heart"
            width="520"
            height="600"
          />
          <img
            class="snoopy-cool"
            src="/images/hero-snoopy.png"
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
          <span>Pregame playlist</span><i>★</i><span>Cake!</span><i>★</i><span>Dancing!</span><i>★</i>
          <span>Add a song!</span><i>★</i><span>Pregame playlist</span><i>★</i>
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

    <section class="details">
      <p class="kicker">Save the date vibes</p>
      <h2>Party details are<br><em>coming soon.</em></h2>
      <p>We’re getting everything just right. Check back soon for the when, where, and all the fun stuff.</p>
      <div class="friends" aria-hidden="true">
        <img src="/images/snoopy-and-woodstock.png" alt="" width="220" height="240" />
      </div>
    </section>
  </main>
`
