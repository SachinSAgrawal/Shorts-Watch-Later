function injectWatchLaterButtons() {
  const items = document.querySelectorAll('ytd-rich-item-renderer');

  items.forEach(item => {
    if (item.querySelector('.custom-watch-later-container')) return;

    const anchor = item.querySelector('a.shortsLockupViewModelHostEndpoint');
    if (!anchor || !anchor.href.includes('watch')) return;

    const videoId = extractVideoId(anchor.href);
    if (!videoId) return;

    const container = document.createElement('div');
    container.className = 'custom-watch-later-container';

    const button = document.createElement('button');
    button.className = 'custom-watch-later-button hover-watch-later';
    button.title = 'Watch later';
    button.dataset.videoId = videoId;

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '-2 -2 28 28');
    icon.setAttribute('width', '28');
    icon.setAttribute('height', '28');
    icon.innerHTML = `
      <path clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 3a1 1 0 00-1 1v5.565l.485.292 3.33 2a1 1 0 001.03-1.714L13 11.435V7a1 1 0 00-1-1Z"/>
    `;
    button.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'custom-watch-later-label';
    label.textContent = 'Watch later';

    button.appendChild(label);
    container.appendChild(button);

    const thumb = item.querySelector('.shortsLockupViewModelHostThumbnailContainer');
    if (thumb) {
      thumb.style.position = 'relative';
      thumb.appendChild(container);
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const added = button.classList.toggle('added');
      const newLabel = added ? 'Added' : 'Watch later';

      button.classList.remove('hover-watch-later', 'hover-added');
      button.classList.add(added ? 'hover-added' : 'hover-watch-later');

      label.textContent = newLabel;
      icon.innerHTML = added
        ? `<path fill="currentColor" d="M19.793 5.793 8.5 17.086l-4.293-4.293a1 1 0 10-1.414 1.414L8.5 19.914 21.207 7.207a1 1 0 10-1.414-1.414Z"/>`
        : `<path clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm0 3a1 1 0 00-1 1v5.565l.485.292 3.33 2a1 1 0 001.03-1.714L13 11.435V7a1 1 0 00-1-1Z"/>`;

      executeYouTubeCommand(added ? 'add-to-watch-later' : 'remove-from-watch-later', videoId);
    });
  });
}

function extractVideoId(url) {
  const match = url.match(/(?:v=|\/shorts\/|\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function executeYouTubeCommand(action, videoId) {
  const appElement = document.querySelector("ytd-app");
  if (!appElement) return;

  const baseParams = {
    clickTrackingParams: "",
    commandMetadata: {
      webCommandMetadata: {
        sendPost: true,
        apiUrl: "/youtubei/v1/browse/edit_playlist"
      }
    },
    playlistEditEndpoint: {
      playlistId: "WL",
      actions: [
        action === 'add-to-watch-later'
          ? { addedVideoId: videoId, action: "ACTION_ADD_VIDEO" }
          : { removedVideoId: videoId, action: "ACTION_REMOVE_VIDEO_BY_VIDEO_ID" }
      ]
    }
  };

  const event = new window.CustomEvent("yt-action", {
    detail: {
      actionName: "yt-service-request",
      returnValue: [],
      args: [{ data: {} }, baseParams],
      optionalAction: false
    }
  });

  appElement.dispatchEvent(event);
}

const observer = new MutationObserver(() => injectWatchLaterButtons());
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('load', () => {
  if (window.location.href.includes('/shorts')) {
    console.log('Injecting watch later buttons into the YouTube shorts page.');
    injectWatchLaterButtons();
  }
});

window.navigation.addEventListener("navigate", (event) => {
    if (event.destination.url.includes('/shorts')) {
    console.log('Injecting watch later buttons into the YouTube shorts page.');
    setTimeout(injectWatchLaterButtons, 1000);
  }
});