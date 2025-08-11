(() => {
  if (window.__yts_speeder_injected) return;
  window.__yts_speeder_injected = true;

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  const container = el(`
    <div id="yts-speeder">
      <div class="yts-header" id="yts-drag">
        <div class="yts-title">YouTube Speeder</div>
        <div class="yts-speed" id="yts-current">1.0x</div>
      </div>
      <input id="yts-slider" class="yts-slider" type="range" min="0.1" max="20" step="0.1" value="1">
      <div class="yts-presets">
        <button data-speed="1">1x</button>
        <button data-speed="2">2x</button>
        <button data-speed="5">5x</button>
        <button data-speed="10">10x</button>
        <button data-speed="20">20x</button>
      </div>
      <div class="yts-footer">
        <div style="font-size:12px;color:#bbb;">By Ansh</div>
        <div class="yts-icons">
          <a href="https://instagram.com/anshmaybee" target="_blank" title="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" stroke-width="1.2"/>
              <circle cx="12" cy="12" r="3.1" stroke="#fff" stroke-width="1.2"/>
              <circle cx="17.5" cy="6.5" r="0.6" fill="#fff" />
            </svg>
          </a>
          <a href="https://t.me/highoncodes" target="_blank" title="Telegram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L2 11.5l5.5 2.1L9.8 22 12 16l10-14z" stroke="#fff" stroke-width="0.8"/>
              <path d="M3.2 11.7l15.1-7.6-8.3 9.3" stroke="#fff" stroke-width="0.9"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `);

  document.documentElement.appendChild(container);

  const slider = document.getElementById('yts-slider');
  const curr = document.getElementById('yts-current');

  function setSpeed(speed) {
    speed = Math.max(0.1, Math.min(20, speed));
    curr.innerText = speed.toFixed(1) + 'x';
    const vids = document.querySelectorAll('video');
    vids.forEach(v => v.playbackRate = speed);
    localStorage.setItem('yts_speed', speed);

    curr.classList.add('glow');
    setTimeout(() => curr.classList.remove('glow'), 300);
  }

  slider.addEventListener('input', e => setSpeed(parseFloat(e.target.value)));

  document.querySelectorAll('.yts-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = parseFloat(btn.dataset.speed);
      slider.value = s;
      setSpeed(s);
    });
  });

  // Restore last speed
  const stored = parseFloat(localStorage.getItem('yts_speed') || '1');
  setSpeed(stored);
  slider.value = stored;

  // Auto reapply speed on video change
  const obs = new MutationObserver(() => {
    const vids = document.querySelectorAll('video');
    vids.forEach(v => v.playbackRate = parseFloat(localStorage.getItem('yts_speed') || '1'));
  });
  obs.observe(document, { childList: true, subtree: true });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === 'ArrowUp') { slider.value = parseFloat(slider.value) + 1; setSpeed(parseFloat(slider.value)); }
    else if (e.shiftKey && e.key === 'ArrowDown') { slider.value = parseFloat(slider.value) - 1; setSpeed(parseFloat(slider.value)); }
    else if (e.key === 'ArrowUp') { slider.value = (parseFloat(slider.value) + 0.1).toFixed(1); setSpeed(parseFloat(slider.value)); }
    else if (e.key === 'ArrowDown') { slider.value = (parseFloat(slider.value) - 0.1).toFixed(1); setSpeed(parseFloat(slider.value)); }
  });

  // Draggable
  let isDragging = false, offsetX, offsetY;
  const dragArea = document.getElementById('yts-drag');
  dragArea.addEventListener('mousedown', e => {
    isDragging = true;
    container.classList.add('dragging');
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
  });
  document.addEventListener('mousemove', e => {
    if (isDragging) {
      container.style.left = (e.clientX - offsetX) + 'px';
      container.style.top = (e.clientY - offsetY) + 'px';
      container.style.right = 'auto';
      container.style.bottom = 'auto';
    }
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('dragging');
  });
})();