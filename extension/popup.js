/**
 * Learnnova AI Chrome Extension - Popup Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  const statusBadge = document.getElementById("backend-status");
  const statusDot = statusBadge.querySelector(".status-dot");
  const statusLabel = statusBadge.querySelector(".status-label");
  const pillIcon = document.getElementById("context-pill-icon");
  const pillText = document.getElementById("context-pill-text");
  const pageTitle = document.getElementById("page-title");
  const pageUrl = document.getElementById("page-url");
  const btnSidePanel = document.getElementById("btn-open-sidepanel");
  const btnSummarize = document.getElementById("btn-quick-summarize");
  const summarizeBtnText = document.getElementById("summarize-btn-text");
  const btnOpenWebApp = document.getElementById("btn-open-webapp");
  const btnToggleSettings = document.getElementById("btn-toggle-settings");
  const settingsDrawer = document.getElementById("settings-drawer");
  const inputApiUrl = document.getElementById("setting-api-url");
  const btnSaveSettings = document.getElementById("btn-save-settings");
  const btnResetSettings = document.getElementById("btn-reset-settings");

  // Load configured settings
  const { apiUrl = "http://localhost:8000", webAppUrl = "http://localhost:3000" } =
    await chrome.storage.local.get(["apiUrl", "webAppUrl"]);

  inputApiUrl.value = apiUrl;

  // Query Active Tab
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const isYouTube =
    activeTab &&
    activeTab.url &&
    (activeTab.url.includes("youtube.com/watch") || activeTab.url.includes("youtu.be/"));

  if (activeTab) {
    pageTitle.textContent = activeTab.title || "Untitled Page";
    pageUrl.textContent = activeTab.url ? new URL(activeTab.url).hostname : "";

    if (isYouTube) {
      pillIcon.textContent = "🎥";
      pillText.textContent = "YouTube Video";
      summarizeBtnText.textContent = "⚡ Summarize YouTube Video";
    } else if (activeTab.url && activeTab.url.endsWith(".pdf")) {
      pillIcon.textContent = "📑";
      pillText.textContent = "PDF Document";
      summarizeBtnText.textContent = "⚡ Summarize PDF Document";
    } else {
      pillIcon.textContent = "📄";
      pillText.textContent = "Web Article / Page";
      summarizeBtnText.textContent = "⚡ Summarize Webpage";
    }
  }

  // Check Backend Health
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${apiUrl}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      statusBadge.classList.add("status-online");
      statusLabel.textContent = data.primary_ai_provider ? "AI Ready" : "Online";
      statusBadge.title = `Connected to ${data.app || "Learnnova"} (${data.primary_ai_provider || "Online"})`;
    } else {
      throw new Error("HTTP error " + res.status);
    }
  } catch (e) {
    statusBadge.classList.add("status-offline");
    statusLabel.textContent = "Server Offline";
    statusBadge.title = `Cannot reach backend at ${apiUrl}. Make sure Docker or FastAPI is running.`;
  }

  // Open in Side Panel
  btnSidePanel.addEventListener("click", async () => {
    if (activeTab && chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open({ windowId: activeTab.windowId });
      window.close();
    }
  });

  // Quick Summarize: Store pending summarize and open Side Panel
  btnSummarize.addEventListener("click", async () => {
    if (!activeTab) return;

    await chrome.storage.local.set({
      pendingAction: {
        type: "summarize",
        url: activeTab.url,
        title: activeTab.title,
        timestamp: Date.now(),
      },
    });

    if (chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open({ windowId: activeTab.windowId });
      window.close();
    }
  });

  // Launch Web App
  btnOpenWebApp.addEventListener("click", async () => {
    await chrome.tabs.create({ url: `${webAppUrl}/app` });
    window.close();
  });

  // Toggle Settings Drawer
  btnToggleSettings.addEventListener("click", () => {
    settingsDrawer.classList.toggle("hidden");
  });

  // Save Settings
  btnSaveSettings.addEventListener("click", async () => {
    const newUrl = inputApiUrl.value.trim().replace(/\/$/, "");
    if (newUrl) {
      await chrome.storage.local.set({ apiUrl: newUrl });
      btnSaveSettings.textContent = "Saved!";
      setTimeout(() => {
        btnSaveSettings.textContent = "Save";
        settingsDrawer.classList.add("hidden");
        window.location.reload();
      }, 700);
    }
  });

  // Reset Settings
  btnResetSettings.addEventListener("click", async () => {
    inputApiUrl.value = "http://localhost:8000";
    await chrome.storage.local.set({ apiUrl: "http://localhost:8000" });
    btnResetSettings.textContent = "Reset!";
    setTimeout(() => {
      btnResetSettings.textContent = "Reset";
      window.location.reload();
    }, 700);
  });
});
