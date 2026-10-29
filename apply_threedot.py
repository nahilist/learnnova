with open(r'src/app/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update lucide-react imports to add MoreVertical, Trash2
import_target = '  Menu,\n} from "lucide-react";'
import_replacement = '  Menu,\n  MoreVertical,\n  Trash2,\n} from "lucide-react";'
assert import_target in content, "import_target not found"
content = content.replace(import_target, import_replacement, 1)

# 2. Add state for activeMenuDocId and expandedRecents
state_target = '  const [historyModalOpen, setHistoryModalOpen] = useState(false);'
state_replacement = '''  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const [expandedRecents, setExpandedRecents] = useState(false);'''
assert state_target in content, "state_target not found"
content = content.replace(state_target, state_replacement, 1)

# 3. Add handleDeleteDoc right after handleOpenDoc
handler_target = '''  // Open Document Handler
  const handleOpenDoc = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setActiveTab("study");
    setStudyTool("reader");
    setActivePage(1);
    setQuizResults(null);
    setSelectedAnswers({});
    handleGenerateFlashcards(doc);
    handleGenerateQuiz(doc);
  };'''

handler_replacement = '''  // Open Document Handler
  const handleOpenDoc = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setActiveTab("study");
    setStudyTool("reader");
    setActivePage(1);
    setQuizResults(null);
    setSelectedAnswers({});
    handleGenerateFlashcards(doc);
    handleGenerateQuiz(doc);
  };

  // Delete Document Handler
  const handleDeleteDoc = async (docId: string, docTitle?: string) => {
    // Optimistically update recentDocs state
    const remaining = recentDocs.filter((d) => d.id !== docId);
    setRecentDocs(remaining);

    // If currently selected doc was deleted, pick next available
    if (selectedDoc?.id === docId) {
      if (remaining.length > 0) {
        setSelectedDoc(remaining[0]);
      } else {
        setSelectedDoc(DEFAULT_DOCUMENTS[0]);
        setActiveTab("dashboard");
      }
    }

    try {
      await fetch(`/api/workspace/documents?id=${encodeURIComponent(docId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete document from backend:", err);
    }
  };'''

assert handler_target in content, "handler_target not found"
content = content.replace(handler_target, handler_replacement, 1)

# 4. Update orderedRecents so new uploads stay at the top
recents_sort_target = '''  const orderedRecents = [...recentDocs].sort((a, b) => {
    if (a.title.startsWith("1.")) return -1;
    if (b.title.startsWith("1.")) return 1;
    if (a.title.startsWith("Positional")) return -1;
    if (b.title.startsWith("Positional")) return 1;
    if (a.title.startsWith("What is")) return -1;
    if (b.title.startsWith("What is")) return 1;
    if (a.title.startsWith("Why is")) return -1;
    if (b.title.startsWith("Why is")) return 1;
    return 0;
  });'''

recents_sort_replacement = '''  const orderedRecents = [...recentDocs];'''
assert recents_sort_target in content, "recents_sort_target not found"
content = content.replace(recents_sort_target, recents_sort_replacement, 1)

# 5. Replace Sidebar Recents section with Three Dots & Delete Dropdown
sidebar_recents_target = '''          {/* Recents Section */}
          <div className="mt-5">
            <span className="text-[11px] font-normal text-neutral-400 px-3 mb-1.5 block">
              Recents
            </span>
            <div className="space-y-0.5">
              {orderedRecents.slice(0, 5).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    handleOpenDoc(doc);
                    setSidebarOpen(false);
                  }}
                  title={doc.title}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-neutral-700 hover:text-neutral-950 hover:bg-[#f0f0f0] transition-colors cursor-pointer text-left group"
                >
                  <Play className="w-3 h-3 text-neutral-400 group-hover:text-neutral-700 shrink-0 fill-transparent stroke-[1.8]" />
                  <span className="truncate">{doc.title}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setSelectedSpaceFilter("all");
                }}
                className="w-full text-left px-3 py-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                ... More
              </button>
            </div>
          </div>'''

sidebar_recents_replacement = '''          {/* Recents Section with Three-Dot Menu */}
          <div className="mt-5">
            <span className="text-[11px] font-normal text-neutral-400 px-3 mb-1.5 block">
              Recents
            </span>
            <div className="space-y-0.5">
              {(expandedRecents ? orderedRecents : orderedRecents.slice(0, 6)).map((doc) => (
                <div
                  key={doc.id}
                  className={`group/item relative flex items-center justify-between rounded-lg transition-colors ${
                    selectedDoc?.id === doc.id
                      ? "bg-[#ebebeb] text-neutral-950 font-medium"
                      : "hover:bg-[#f0f0f0] text-neutral-700"
                  }`}
                >
                  <button
                    onClick={() => {
                      handleOpenDoc(doc);
                      setSidebarOpen(false);
                    }}
                    title={doc.title}
                    className="flex-1 flex items-center gap-2 px-2.5 py-1.5 text-xs text-left truncate cursor-pointer min-w-0"
                  >
                    <Play className="w-3 h-3 text-neutral-400 group-hover/item:text-neutral-700 shrink-0 fill-transparent stroke-[1.8]" />
                    <span className="truncate">{doc.title}</span>
                  </button>

                  {/* Three Dot Menu Trigger */}
                  <div className="relative shrink-0 pr-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                      }}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/70 opacity-0 group-hover/item:opacity-100 transition-opacity focus:opacity-100 cursor-pointer"
                      title="Options"
                      aria-label={`Options for ${doc.title}`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Floating Dropdown Menu */}
                    {activeMenuDocId === doc.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuDocId(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-neutral-200/90 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuDocId(null);
                              handleDeleteDoc(doc.id, doc.title);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {orderedRecents.length > 6 && (
                <button
                  onClick={() => setExpandedRecents(!expandedRecents)}
                  className="w-full text-left px-3 py-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  {expandedRecents ? "Show less" : `... More (${orderedRecents.length})`}
                </button>
              )}
            </div>
          </div>'''

assert sidebar_recents_target in content, "sidebar_recents_target not found"
content = content.replace(sidebar_recents_target, sidebar_recents_replacement, 1)

# 6. Update Study History modal items to include delete icon
history_target = '''            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    handleOpenDoc(doc);
                    setHistoryModalOpen(false);
                  }}
                  className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{doc.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {doc.space} • {doc.pagesOrDuration} • {doc.date}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 shrink-0">Open →</span>
                </div>
              ))}
            </div>'''

history_replacement = '''            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div
                    onClick={() => {
                      handleOpenDoc(doc);
                      setHistoryModalOpen(false);
                    }}
                    className="min-w-0 pr-3 flex-1"
                  >
                    <p className="text-xs font-semibold text-neutral-900 truncate">{doc.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {doc.space} • {doc.pagesOrDuration} • {doc.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        handleOpenDoc(doc);
                        setHistoryModalOpen(false);
                      }}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      Open →
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDoc(doc.id, doc.title);
                      }}
                      className="p-1 rounded-md text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>'''

assert history_target in content, "history_target not found"
content = content.replace(history_target, history_replacement, 1)

with open(r'src/app/app/page.tsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print("Applied three-dot menu and delete functionality to app page!")

