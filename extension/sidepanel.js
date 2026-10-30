/**
 * Learnnova AI Chrome Extension - Side Panel Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const stripIcon = document.getElementById("strip-icon");
  const stripType = document.getElementById("strip-type");
  const stripTitle = document.getElementById("strip-title");
  const sidepanelStatus = document.getElementById("sidepanel-status");
  const btnSyncTab = document.getElementById("btn-sync-tab");
  const btnOpenFullApp = document.getElementById("btn-open-fullapp");

  const navTabs = document.querySelectorAll(".nav-tab");
  const tabPanels = document.querySelectorAll(".tab-panel");

  // Summary Elements
  const summaryHero = document.getElementById("summary-hero");
  const summaryHeroTitle = document.getElementById("summary-hero-title");
  const summaryHeroDesc = document.getElementById("summary-hero-desc");
  const btnGenerateSummary = document.getElementById("btn-generate-summary");
  const btnGenerateText = document.getElementById("btn-generate-text");
  const summaryLoading = document.getElementById("summary-loading");
  const summaryLoadingText = document.getElementById("summary-loading-text");
  const summaryError = document.getElementById("summary-error");
  const summaryErrorText = document.getElementById("summary-error-text");
  const btnRetrySummary = document.getElementById("btn-retry-summary");
  const summaryResult = document.getElementById("summary-result");
  const summaryText = document.getElementById("summary-text");
  const takeawaysList = document.getElementById("takeaways-list");
  const chaptersSection = document.getElementById("chapters-section");
  const chaptersList = document.getElementById("chapters-list");
  const btnCopySummary = document.getElementById("btn-copy-summary");

  // Chat Elements
  const chatMessages = document.getElementById("chat-messages");
  const chatSuggestions = document.getElementById("chat-suggestions");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");

  // Practice Elements
  const btnToggleQuiz = document.getElementById("btn-toggle-quiz");
  const btnToggleFlashcards = document.getElementById("btn-toggle-flashcards");
  const quizContainer = document.getElementById("quiz-container");
  const flashcardsContainer = document.getElementById("flashcards-container");
  const quizEmpty = document.getElementById("quiz-empty");
  const quizContent = document.getElementById("quiz-content");
  const btnGenerateQuiz = document.getElementById("btn-generate-quiz");
  const quizCounter = document.getElementById("quiz-counter");
  const quizScore = document.getElementById("quiz-score");
  const quizCardWrapper = document.getElementById("quiz-card-wrapper");

  const flashcardsEmpty = document.getElementById("flashcards-empty");
  const flashcardsContent = document.getElementById("flashcards-content");
  const btnGenerateFlashcards = document.getElementById("btn-generate-flashcards");
  const flashcardElement = document.getElementById("flashcard-element");
  const fcFrontText = document.getElementById("fc-front-text");
  const fcBackText = document.getElementById("fc-back-text");
  const fcCounter = document.getElementById("fc-counter");
  const fcPrev = document.getElementById("fc-prev");
  const fcNext = document.getElementById("fc-next");

  // State
  let currentTab = null;
  let isYouTube = false;
  let activeContextData = {
    summary: "",
    takeaways: [],
    chapters: [],
    quizQuestions: [],
    flashcards: [],
    pageText: "",
  };
  let chatHistory = [];
  let currentQuizIndex = 0;
  let currentQuizScore = 0;
  let currentFlashcardIndex = 0;

  // Settings - defaults to live AWS EC2 backend & Vercel web workspace
  let { apiUrl = "http://13.196.187.230", webAppUrl = "https://learnnova-taupe.vercel.app" } =
    await chrome.storage.local.get(["apiUrl", "webAppUrl"]);

  if (!apiUrl || apiUrl === "http://localhost:8000") {
    apiUrl = "http://13.196.187.230";
    await chrome.storage.local.set({ apiUrl });
  }

  if (!webAppUrl || webAppUrl === "http://localhost:3000" || webAppUrl === "http://127.0.0.1:3000") {
    webAppUrl = "https://learnnova-taupe.vercel.app";
    await chrome.storage.local.set({ webAppUrl });
  }

  // Sidepanel Settings Elements
  const btnSidepanelSettings = document.getElementById("btn-sidepanel-settings");
  const sidepanelSettingsDrawer = document.getElementById("sidepanel-settings-drawer");
  const spSettingApiUrl = document.getElementById("sp-setting-api-url");
  const btnSpSaveSettings = document.getElementById("btn-sp-save-settings");
  const btnSpResetSettings = document.getElementById("btn-sp-reset-settings");

  if (spSettingApiUrl) spSettingApiUrl.value = apiUrl;

  if (btnSidepanelSettings && sidepanelSettingsDrawer) {
    btnSidepanelSettings.addEventListener("click", () => {
      sidepanelSettingsDrawer.classList.toggle("hidden");
    });
  }

  if (btnSpSaveSettings && spSettingApiUrl) {
    btnSpSaveSettings.addEventListener("click", async () => {
      const newUrl = spSettingApiUrl.value.trim().replace(/\/$/, "");
      if (newUrl) {
        apiUrl = newUrl;
        await chrome.storage.local.set({ apiUrl });
        btnSpSaveSettings.textContent = "Saved!";
        setTimeout(async () => {
          btnSpSaveSettings.textContent = "Save Server";
          sidepanelSettingsDrawer.classList.add("hidden");
          await checkServerHealth();
        }, 600);
      }
    });
  }

  if (btnSpResetSettings && spSettingApiUrl) {
    btnSpResetSettings.addEventListener("click", async () => {
      apiUrl = "http://13.196.187.230";
      webAppUrl = "https://learnnova-taupe.vercel.app";
      spSettingApiUrl.value = apiUrl;
      await chrome.storage.local.set({ apiUrl, webAppUrl });
      btnSpResetSettings.textContent = "Reset to EC2!";
      setTimeout(async () => {
        btnSpResetSettings.textContent = "Reset to EC2";
        await checkServerHealth();
      }, 600);
    });
  }

  async function checkServerHealth() {
    if (!sidepanelStatus) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${apiUrl}/api/health`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        sidepanelStatus.className = "status-badge status-online";
        sidepanelStatus.querySelector(".status-label").textContent = "AI Online";
        sidepanelStatus.title = `Connected to AWS EC2: ${apiUrl}`;
        return true;
      }
    } catch {}
    sidepanelStatus.className = "status-badge status-offline";
    sidepanelStatus.querySelector(".status-label").textContent = "Offline";
    sidepanelStatus.title = `Cannot reach server at ${apiUrl}.`;
    return false;
  }

  await checkServerHealth();

  // --------------------------------------------------------------------------
  // Tab Switching
  // --------------------------------------------------------------------------
  navTabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      const targetTab = tabBtn.getAttribute("data-tab");
      navTabs.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      tabBtn.classList.add("active");
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // --------------------------------------------------------------------------
  // Detect Active Browser Tab
  // --------------------------------------------------------------------------
  async function syncActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;
      currentTab = tab;

      isYouTube =
        tab.url && (tab.url.includes("youtube.com/watch") || tab.url.includes("youtu.be/"));

      stripTitle.textContent = tab.title || "Untitled Tab";

      if (isYouTube) {
        stripIcon.textContent = "🎥";
        stripType.textContent = "YouTube Video";
        summaryHeroTitle.textContent = "Summarize YouTube Lecture";
        summaryHeroDesc.textContent =
          "Extract full video transcript, key takeaways, and timestamps automatically.";
        btnGenerateText.textContent = "⚡ Summarize Video";
      } else if (tab.url && tab.url.endsWith(".pdf")) {
        stripIcon.textContent = "📑";
        stripType.textContent = "PDF Document";
        summaryHeroTitle.textContent = "Study PDF Document";
        summaryHeroDesc.textContent =
          "Generate structured notes, active recall flashcards, and practice quiz.";
        btnGenerateText.textContent = "⚡ Summarize PDF";
      } else {
        stripIcon.textContent = "📄";
        stripType.textContent = "Web Article";
        summaryHeroTitle.textContent = "Study Web Article";
        summaryHeroDesc.textContent =
          "Turn this webpage into clean notes, takeaways, and study questions.";
        btnGenerateText.textContent = "⚡ Summarize Webpage";
      }
    } catch (err) {
      console.error("Failed to sync tab:", err);
    }
  }

  await syncActiveTab();

  // Refresh sync button
  btnSyncTab.addEventListener("click", async () => {
    btnSyncTab.style.transform = "rotate(180deg)";
    setTimeout(() => (btnSyncTab.style.transform = "none"), 300);
    await syncActiveTab();
  });

  // Open Full Web App
  btnOpenFullApp.addEventListener("click", async () => {
    await chrome.tabs.create({ url: `${webAppUrl}/app` });
  });

  // --------------------------------------------------------------------------
  // Page Text Extractor (for non-YouTube web pages)
  // --------------------------------------------------------------------------
  async function extractWebpageContent() {
    if (!currentTab || !currentTab.id) return "";

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: () => {
          // Priority selectors for main article text
          const article = document.querySelector("article, main, .content, #content, [role='main']");
          const target = article || document.body;
          // Clean out unwanted elements
          const clone = target.cloneNode(true);
          const removeSelectors = "header, footer, nav, script, style, noscript, iframe, .ads, .sidebar";
          clone.querySelectorAll(removeSelectors).forEach((el) => el.remove());
          const text = clone.innerText || "";
          return text.replace(/\s+/g, " ").trim().slice(0, 15000);
        },
      });

      if (results && results[0] && results[0].result) {
        return results[0].result;
      }
    } catch (e) {
      console.warn("Could not inject content extractor:", e);
    }
    return currentTab.title || "";
  }

  // --------------------------------------------------------------------------
  // Generate Summary & Notes
  // --------------------------------------------------------------------------
  async function handleSummarize() {
    summaryHero.classList.add("hidden");
    summaryError.classList.add("hidden");
    summaryResult.classList.add("hidden");
    summaryLoading.classList.remove("hidden");

    try {
      if (isYouTube) {
        summaryLoadingText.textContent = "Fetching YouTube transcript & analyzing video...";

        const res = await fetch(`${apiUrl}/api/youtube/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentTab.url }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || err.error || `Server responded with ${res.status}`);
        }

        const data = await res.json();
        activeContextData = {
          summary: data.summary || "",
          takeaways: data.keyTakeaways || [],
          chapters: data.chapters || [],
          quizQuestions: data.quizQuestions || [],
          flashcards: data.flashcards || [],
          pageText: data.summary,
        };

        renderSummaryResults();
      } else {
        summaryLoadingText.textContent = "Extracting article text & generating notes...";
        const pageText = await extractWebpageContent();

        if (!pageText || pageText.length < 50) {
          throw new Error("Page content is too short or protected to extract.");
        }

        activeContextData.pageText = pageText;

        // Ask AI tutor to generate structured summary
        const res = await fetch(`${apiUrl}/api/chat/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message:
              "Generate an executive summary of this material (3-4 concise sentences) followed by exactly 4 bulleted key takeaways.",
            context: pageText.slice(0, 8000),
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to generate summary (${res.status})`);
        }

        const chatData = await res.json();
        const reply = chatData.reply || "";

        // Parse summary & bullet points
        const lines = reply.split("\n").filter((l) => l.trim().length > 0);
        let summaryPart = "";
        const takeawaysPart = [];

        lines.forEach((line) => {
          if (line.match(/^[-*•\d.]\s+/)) {
            takeawaysPart.push(line.replace(/^[-*•\d.]\s+/, "").trim());
          } else if (!summaryPart) {
            summaryPart = line;
          } else {
            summaryPart += " " + line;
          }
        });

        activeContextData.summary = summaryPart || reply;
        activeContextData.takeaways =
          takeawaysPart.length > 0
            ? takeawaysPart
            : [
                "Comprehensive conceptual overview provided by author.",
                "Key practical methodologies and actionable insights outlined.",
                "Fundamental principles highlighted for academic review.",
              ];

        renderSummaryResults();
      }
    } catch (err) {
      summaryLoading.classList.add("hidden");
      summaryError.classList.remove("hidden");
      if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError"))) {
        summaryErrorText.innerHTML = `<strong>Backend Offline:</strong> Cannot reach AI server at <code>${apiUrl}</code>.<br><span style="font-size:11px;opacity:0.85;">Please start the backend server on port 8000 (FastAPI or Docker).</span>`;
      } else {
        summaryErrorText.textContent = err.message || "Failed to analyze page.";
      }
      checkServerHealth();
    }
  }

  function renderSummaryResults() {
    summaryLoading.classList.add("hidden");
    summaryResult.classList.remove("hidden");

    summaryText.textContent = activeContextData.summary;

    // Takeaways
    takeawaysList.innerHTML = "";
    activeContextData.takeaways.forEach((point) => {
      const li = document.createElement("li");
      li.className = "takeaway-item";
      li.innerHTML = `<span class="takeaway-bullet">✓</span><span>${escapeHtml(point)}</span>`;
      takeawaysList.appendChild(li);
    });

    // Chapters (YouTube only)
    if (activeContextData.chapters && activeContextData.chapters.length > 0) {
      chaptersSection.classList.remove("hidden");
      chaptersList.innerHTML = "";
      activeContextData.chapters.forEach((ch) => {
        const div = document.createElement("div");
        div.className = "chapter-item";
        div.innerHTML = `<span class="chapter-time">${escapeHtml(ch.time)}</span><span class="chapter-title">${escapeHtml(ch.title)}</span>`;
        div.addEventListener("click", () => jumpYouTubeTime(ch.time));
        chaptersList.appendChild(div);
      });
    } else {
      chaptersSection.classList.add("hidden");
    }

    // Auto populate practice tab if questions exist
    if (activeContextData.quizQuestions.length > 0) {
      renderQuizQuestion(0);
    }
    if (activeContextData.flashcards.length > 0) {
      renderFlashcard(0);
    }
  }

  // Jump YouTube time
  async function jumpYouTubeTime(timeStr) {
    if (!currentTab || !currentTab.id) return;
    const parts = timeStr.split(":").map(Number);
    let seconds = 0;
    if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

    try {
      await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: (sec) => {
          const video = document.querySelector("video");
          if (video) video.currentTime = sec;
        },
        args: [seconds],
      });
    } catch (e) {
      console.warn("Could not seek video:", e);
    }
  }

  btnGenerateSummary.addEventListener("click", handleSummarize);
  btnRetrySummary.addEventListener("click", handleSummarize);

  // Copy Summary
  btnCopySummary.addEventListener("click", () => {
    const textToCopy = `${activeContextData.summary}\n\nKey Takeaways:\n${activeContextData.takeaways.map((t) => "- " + t).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    btnCopySummary.querySelector("span").textContent = "Copied!";
    setTimeout(() => {
      btnCopySummary.querySelector("span").textContent = "Copy";
    }, 1500);
  });

  // --------------------------------------------------------------------------
  // AI Tutor Chat
  // --------------------------------------------------------------------------
  async function sendChatMessage(userText) {
    if (!userText.trim()) return;

    appendBubble("user", userText);
    chatInput.value = "";
    chatSendBtn.disabled = true;

    // Loading bubble
    const loadingId = "loading-" + Date.now();
    appendBubble("ai", "Thinking...", loadingId);

    try {
      // Build context from active document/video
      const context =
        activeContextData.summary ||
        activeContextData.pageText.slice(0, 6000) ||
        currentTab?.title ||
        "";

      const res = await fetch(`${apiUrl}/api/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          context: context,
          history: chatHistory.slice(-6),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I couldn't generate a response. Please try again.";

      // Update loading bubble
      const loadingBubble = document.getElementById(loadingId);
      if (loadingBubble) {
        loadingBubble.querySelector(".bubble-body p").textContent = reply;
      }

      chatHistory.push({ sender: "user", text: userText });
      chatHistory.push({ sender: "ai", text: reply });
    } catch (err) {
      const loadingBubble = document.getElementById(loadingId);
      if (loadingBubble) {
        if (err.message && err.message.includes("Failed to fetch")) {
          loadingBubble.querySelector(".bubble-body p").innerHTML =
            `⚠️ <strong>Backend Offline:</strong> Could not connect to <code>${apiUrl}</code>. Please start the Python backend on port 8000.`;
        } else {
          loadingBubble.querySelector(".bubble-body p").textContent =
            "⚠️ Error: " + (err.message || "Failed to contact AI Tutor.");
        }
      }
    } finally {
      chatSendBtn.disabled = false;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function appendBubble(sender, text, id) {
    const div = document.createElement("div");
    div.className = `chat-bubble ${sender}-bubble`;
    if (id) div.id = id;

    if (sender === "ai") {
      div.innerHTML = `
        <div class="bubble-avatar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.2 4.5C6.3 4.5 7.2 5.4 7.2 6.5V11.8C7.2 14.5 9.4 16.7 12.1 16.7C13.2 16.7 14.1 17.6 14.1 18.7C14.1 19.8 13.2 20.7 12.1 20.7C7.2 20.7 3.2 16.7 3.2 11.8V6.5C3.2 5.4 4.1 4.5 5.2 4.5Z" />
            <path d="M18.8 3.3C19.9 3.3 20.8 4.2 20.8 5.3V12.7C20.8 13.8 19.9 14.7 18.8 14.7C17.7 14.7 16.8 13.8 16.8 12.7V5.3C16.8 4.2 17.7 3.3 18.8 3.3Z" />
          </svg>
        </div>
        <div class="bubble-body"><p>${escapeHtml(text)}</p></div>
      `;
    } else {
      div.innerHTML = `<p>${escapeHtml(text)}</p>`;
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendChatMessage(chatInput.value);
  });

  // Suggestion chips
  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const prompt = chip.getAttribute("data-prompt");
      sendChatMessage(prompt);
    });
  });

  // --------------------------------------------------------------------------
  // Practice Tab (Quiz & Flashcards)
  // --------------------------------------------------------------------------
  btnToggleQuiz.addEventListener("click", () => {
    btnToggleQuiz.classList.add("active");
    btnToggleFlashcards.classList.remove("active");
    quizContainer.classList.remove("hidden");
    flashcardsContainer.classList.add("hidden");
  });

  btnToggleFlashcards.addEventListener("click", () => {
    btnToggleFlashcards.classList.add("active");
    btnToggleQuiz.classList.remove("active");
    flashcardsContainer.classList.remove("hidden");
    quizContainer.classList.add("hidden");
  });

  // Generate Quiz
  btnGenerateQuiz.addEventListener("click", async () => {
    btnGenerateQuiz.disabled = true;
    btnGenerateQuiz.textContent = "Generating...";

    try {
      const content =
        activeContextData.summary ||
        (await extractWebpageContent()) ||
        currentTab?.title ||
        "";

      const res = await fetch(`${apiUrl}/api/study/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, count: 4, difficulty: "medium" }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");

      const data = await res.json();
      activeContextData.quizQuestions = data.questions || [];
      renderQuizQuestion(0);
    } catch (err) {
      alert("Quiz generation failed: " + err.message);
    } finally {
      btnGenerateQuiz.disabled = false;
      btnGenerateQuiz.textContent = "Generate Quiz";
    }
  });

  function renderQuizQuestion(index) {
    const qList = activeContextData.quizQuestions;
    if (!qList || qList.length === 0) return;

    quizEmpty.classList.add("hidden");
    quizContent.classList.remove("hidden");

    currentQuizIndex = index;
    const q = qList[index];

    quizCounter.textContent = `Question ${index + 1} of ${qList.length}`;
    quizScore.textContent = `Score: ${currentQuizScore}`;

    quizCardWrapper.innerHTML = `
      <div class="quiz-card">
        <p class="quiz-question">${index + 1}. ${escapeHtml(q.question)}</p>
        <div class="quiz-options">
          ${q.options
            .map(
              (opt, i) =>
                `<button class="quiz-option" data-index="${i}">${escapeHtml(opt)}</button>`
            )
            .join("")}
        </div>
        <div class="quiz-explanation hidden" id="quiz-exp">
          ${escapeHtml(q.explanation || "Correct answer selected.")}
        </div>
        <button class="btn btn-secondary btn-small hidden" id="btn-next-question">
          ${index + 1 === qList.length ? "Finish Quiz" : "Next Question →"}
        </button>
      </div>
    `;

    const optionBtns = quizCardWrapper.querySelectorAll(".quiz-option");
    const expDiv = quizCardWrapper.querySelector("#quiz-exp");
    const nextBtn = quizCardWrapper.querySelector("#btn-next-question");

    optionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedIdx = Number(btn.getAttribute("data-index"));
        const isCorrect = selectedIdx === (q.correctIndex ?? 0);

        optionBtns.forEach((b) => (b.disabled = true));

        if (isCorrect) {
          btn.classList.add("correct");
          currentQuizScore += 10;
          quizScore.textContent = `Score: ${currentQuizScore}`;
        } else {
          btn.classList.add("incorrect");
          if (optionBtns[q.correctIndex ?? 0]) {
            optionBtns[q.correctIndex ?? 0].classList.add("correct");
          }
        }

        expDiv.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
      });
    });

    nextBtn.addEventListener("click", () => {
      if (index + 1 < qList.length) {
        renderQuizQuestion(index + 1);
      } else {
        quizCardWrapper.innerHTML = `
          <div class="practice-empty">
            <span class="empty-emoji">🏆</span>
            <h3>Quiz Completed!</h3>
            <p>Final Score: <strong>${currentQuizScore} pts</strong></p>
            <button class="btn btn-primary" id="btn-restart-quiz">Try Again</button>
          </div>
        `;
        document.getElementById("btn-restart-quiz").addEventListener("click", () => {
          currentQuizScore = 0;
          renderQuizQuestion(0);
        });
      }
    });
  }

  // Generate Flashcards
  btnGenerateFlashcards.addEventListener("click", async () => {
    btnGenerateFlashcards.disabled = true;
    btnGenerateFlashcards.textContent = "Generating...";

    try {
      const content =
        activeContextData.summary ||
        (await extractWebpageContent()) ||
        currentTab?.title ||
        "";

      const res = await fetch(`${apiUrl}/api/study/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, count: 5 }),
      });

      if (!res.ok) throw new Error("Failed to generate flashcards");

      const data = await res.json();
      activeContextData.flashcards = data.flashcards || [];
      renderFlashcard(0);
    } catch (err) {
      alert("Flashcard generation failed: " + err.message);
    } finally {
      btnGenerateFlashcards.disabled = false;
      btnGenerateFlashcards.textContent = "Generate Flashcards";
    }
  });

  function renderFlashcard(index) {
    const fcList = activeContextData.flashcards;
    if (!fcList || fcList.length === 0) return;

    flashcardsEmpty.classList.add("hidden");
    flashcardsContent.classList.remove("hidden");

    currentFlashcardIndex = index;
    flashcardElement.classList.remove("flipped");

    const fc = fcList[index];
    fcFrontText.textContent = fc.front;
    fcBackText.textContent = fc.back;
    fcCounter.textContent = `${index + 1} / ${fcList.length}`;

    fcPrev.disabled = index === 0;
    fcNext.disabled = index === fcList.length - 1;
  }

  flashcardElement.addEventListener("click", () => {
    flashcardElement.classList.toggle("flipped");
  });

  fcPrev.addEventListener("click", () => {
    if (currentFlashcardIndex > 0) renderFlashcard(currentFlashcardIndex - 1);
  });

  fcNext.addEventListener("click", () => {
    if (currentFlashcardIndex < activeContextData.flashcards.length - 1) {
      renderFlashcard(currentFlashcardIndex + 1);
    }
  });

  // --------------------------------------------------------------------------
  // Handle Pending Actions from Context Menu or Popup
  // --------------------------------------------------------------------------
  const { pendingAction } = await chrome.storage.local.get(["pendingAction"]);
  if (pendingAction) {
    await chrome.storage.local.remove(["pendingAction"]);

    if (pendingAction.type === "explain" && pendingAction.text) {
      // Switch to Chat tab
      const chatTabBtn = document.querySelector('.nav-tab[data-tab="chat"]');
      if (chatTabBtn) chatTabBtn.click();
      sendChatMessage(`Can you explain what this means in context?\n\n"${pendingAction.text}"`);
    } else if (pendingAction.type === "summarize") {
      // Trigger summary immediately
      handleSummarize();
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});

