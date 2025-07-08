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
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');
    icon.innerHTML = `
      <path clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"
        d="M20.5 12c0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5s8.5 3.806 8.5 8.5Zm1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.25-5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7Z"/>
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
        ? `<path fill="currentColor" d="m9 18.7-5.4-5.4.7-.7L9 17.3 20.6 5.6l.7.7L9 18.7z"/>`
        : `<path clip-rule="evenodd" fill="currentColor" fill-rule="evenodd"
            d="M20.5 12c0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5s8.5 3.806 8.5 8.5Zm1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.25-5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7Z"/>`;

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