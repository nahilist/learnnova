/**
 * Learnnova AI Chrome Extension - Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener(() => {
  // Context menus
  chrome.contextMenus.create({
    id: "learnnova-explain",
    title: "Explain with Learnnova AI",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "learnnova-summarize",
    title: "Summarize this page with Learnnova AI",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    id: "learnnova-open-sidepanel",
    title: "Open Learnnova Side Panel",
    contexts: ["all"],
  });

  // Default settings pointing to live AWS EC2 backend and Vercel web app
  chrome.storage.local.get(["apiUrl", "webAppUrl"], (data) => {
    if (!data.apiUrl || data.apiUrl === "http://localhost:8000") {
      chrome.storage.local.set({ apiUrl: "http://13.196.187.230" });
    }
    if (!data.webAppUrl || data.webAppUrl === "http://localhost:3000" || data.webAppUrl === "http://127.0.0.1:3000") {
      chrome.storage.local.set({ webAppUrl: "https://learnnova-taupe.vercel.app" });
    }
  });
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return;

  try {
    // Open the side panel for current window
    if (chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }

    if (info.menuItemId === "learnnova-explain" && info.selectionText) {
      await chrome.storage.local.set({
        pendingAction: {
          type: "explain",
          text: info.selectionText,
          url: tab.url,
          title: tab.title,
          timestamp: Date.now(),
        },
      });
    } else if (info.menuItemId === "learnnova-summarize") {
      await chrome.storage.local.set({
        pendingAction: {
          type: "summarize",
          url: tab.url,
          title: tab.title,
          timestamp: Date.now(),
        },
      });
    }
  } catch (err) {
    console.error("Context menu execution failed:", err);
  }
});

// Handle Keyboard Shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-side-panel") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  }
});

// Message Routing
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "OPEN_SIDEPANEL") {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && chrome.sidePanel && chrome.sidePanel.open) {
          await chrome.sidePanel.open({ windowId: tab.windowId });
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "Side panel not supported" });
        }
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // Keep message channel open for async response
  }
});

