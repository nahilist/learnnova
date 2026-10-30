/**
 * Learnnova AI Chrome Extension - YouTube Content Script
 */

(function () {
  let injected = false;

  function tryInjectYouTubeButton() {
    if (!window.location.href.includes("watch?v=")) return;
    if (document.getElementById("learnnova-yt-btn")) return;

    // YouTube action bar containers
    const actionsBar =
      document.querySelector("#top-level-buttons-computed") ||
      document.querySelector("#actions-inner #top-level-buttons-computed") ||
      document.querySelector("ytd-watch-metadata #actions");

    if (!actionsBar) return;

    const btn = document.createElement("button");
    btn.id = "learnnova-yt-btn";
    btn.className = "learnnova-yt-btn";
    btn.title = "Summarize video with Learnnova AI";
    btn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M5.2 4.5C6.3 4.5 7.2 5.4 7.2 6.5V11.8C7.2 14.5 9.4 16.7 12.1 16.7C13.2 16.7 14.1 17.6 14.1 18.7C14.1 19.8 13.2 20.7 12.1 20.7C7.2 20.7 3.2 16.7 3.2 11.8V6.5C3.2 5.4 4.1 4.5 5.2 4.5Z" />
        <path d="M18.8 3.3C19.9 3.3 20.8 4.2 20.8 5.3V12.7C20.8 13.8 19.9 14.7 18.8 14.7C17.7 14.7 16.8 13.8 16.8 12.7V5.3C16.8 4.2 17.7 3.3 18.8 3.3Z" />
      </svg>
      <span>⚡ AI Notes</span>
    `;

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Set pending action
      await chrome.storage.local.set({
        pendingAction: {
          type: "summarize",
          url: window.location.href,
          title: document.title,
          timestamp: Date.now(),
        },
      });

      // Request service worker to open side panel
      chrome.runtime.sendMessage({ action: "OPEN_SIDEPANEL" });
    });

    actionsBar.appendChild(btn);
  }

  // Observe navigation changes on YouTube (Single Page App)
  const observer = new MutationObserver(() => {
    tryInjectYouTubeButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check
  setTimeout(tryInjectYouTubeButton, 1000);
})();

