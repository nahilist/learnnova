/**
 * Learnnova AI Chrome Extension - Popup Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  const statusBadge = document.getElementById("backend-status");
  const statusLabel = statusBadge.querySelector(".status-label");
  const pillIcon = document.getElementById("context-pill-icon");
  const pillText = document.getElementById("context-pill-text");
  const pageTitle = document.getElementById("page-title");
  const pageUrl = document.getElementById("page-url");
  const btnSidePanel = document.getElementById("btn-open-sidepanel");
  const btnSummarize = document.getElementById("btn-quick-summarize");
  const summarizeBtnText = document.getElementById("summarize-btn-text");
  const btnOpenWebApp = document.getElementById("btn-open-webapp");

  // Fixed backend & web app endpoints
  const apiUrl = "http://13.196.187.230";
  const webAppUrl = "https://learnnova-taupe.vercel.app";

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
  } catch {
    statusBadge.classList.add("status-offline");
    statusLabel.textContent = "Offline";
    statusBadge.title = "AI Tutor is temporarily offline.";
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
});

