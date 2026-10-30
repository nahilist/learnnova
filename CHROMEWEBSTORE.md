# Chrome Web Store Listing — Learnnova AI - Study & Video Tutor

> Last Updated: 2026-10-30

## Store Listing

**Extension Name** [REQUIRED]
Learnnova AI - Study & Video Tutor

**Short Description** [REQUIRED]
Your AI Study Partner: Summarize YouTube videos, explain webpages, generate interactive quizzes, and chat with AI in real time.

**Detailed Description** [REQUIRED]
Transform your browsing and video watching into an active, high-retention learning experience with Learnnova AI.

Whether you are studying complex university lectures, researching articles, or learning to code, Learnnova AI works right alongside you in Chrome's side panel without switching tabs.

KEY FEATURES:
- Instant YouTube Video Summaries: Get chapter-by-chapter breakdowns, key takeaways, and key concept timestamps in seconds.
- Webpage & Article Explainer: Break down dense documentation, research papers, and blog posts into digestible study notes.
- Interactive Practice & Quizzes: Automatically generate 4-option practice quizzes and active-recall flashcards from any video or article.
- Real-Time AI Tutor Chat: Ask follow-up questions, request simplified analogies, or get code explanations grounded in what you are currently watching or reading.
- Seamless Side Panel Workflow: Keep your video playing or article open while chatting with your tutor side-by-side.

HOW TO USE:
1. Open any YouTube video or educational article.
2. Click the Learnnova AI icon in your browser toolbar or press the side panel shortcut.
3. Review your auto-generated study notes or ask the AI Tutor any question!

PRIVACY & SECURITY:
Learnnova AI processes content only when you explicitly open the side panel or request study assistance. Your browsing history is never sold, tracked, or shared with third-party advertisers.

SUPPORT & FEEDBACK:
Have questions or feature requests? Contact our team at support@learnnova.ai or visit our web platform at https://learnnova.ai.

**Category** [REQUIRED]
Productivity (Secondary: Education)

**Single Purpose** [REQUIRED]
Generates study notes, summaries, interactive quizzes, and grounded AI tutor explanations for web articles and YouTube videos.

**Primary Language** [REQUIRED]
English

---

## Permissions Justification

Every permission below has a strict, specific justification for Chrome Web Store compliance:

| Permission | Justification |
| :--- | :--- |
| `storage` | Required to securely store user settings, theme preference, and study session history locally in the browser. |
| `activeTab` | Required to access the URL and content of the current educational page or YouTube video only when the user opens the side panel. |
| `scripting` | Required to safely extract readable article text or video subtitles from the active page for study note generation. |
| `sidePanel` | Core UI of the extension. Provides a dedicated sidebar so students can read or watch content while studying with the AI tutor. |
| `tabs` | Required to detect tab navigation and ensure study notes match the currently active educational video or document. |
| `contextMenus` | Provides a convenient right-click menu ("Ask Learnnova AI") when students highlight unfamiliar terms on a webpage. |

### Host Permissions Justification

| Host Pattern | Justification |
| :--- | :--- |
| `https://*/*`, `http://*/*` | Required to extract educational article text from user-opened study websites upon request, and to communicate with the Learnnova AI backend API. |

---

## Privacy & Data Use Disclosures

- **Does this extension collect personally identifiable information (PII)?**
  No. It processes document text and video URLs only during active study sessions.
- **Does this extension sell or transfer user data?**
  No. Data is never sold or used for marketing/advertising.
- **Is the data used for creditworthiness, lending, or advertising?**
  No.

---

## Chrome Web Store Assets Checklist

- [x] Extension Icons: `icon-16.png`, `icon-32.png`, `icon-48.png`, `icon-128.png`
- [ ] Screenshot 1 (1280x800 or 640x400): YouTube video with Learnnova side panel open showing Chapter Notes & Key Takeaways.
- [ ] Screenshot 2 (1280x800 or 640x400): AI Chat tab answering a student query in real time.
- [ ] Screenshot 3 (1280x800 or 640x400): Practice tab showing interactive Quiz and Flashcards.
- [ ] Promotional Tile (Small: 440x280, Marquee: 1400x560): Optional for featured store placement.

