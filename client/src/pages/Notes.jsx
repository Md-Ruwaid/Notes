import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fetchNotes = async () => {
    const response = await axios.get(`${API_BASE_URL}/notes/get`);
    return response.data.notes;
};

function Notes() {
    const [content, setContent] = useState("");
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const getNotes = useCallback(async () => {
        try {
            setNotes(await fetchNotes());
            setError("");
        } catch {
            setError("We couldn't load your notes. Check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isActive = true;

        fetchNotes()
            .then((loadedNotes) => {
                if (isActive) {
                    setNotes(loadedNotes);
                    setError("");
                }
            })
            .catch(() => {
                if (isActive) {
                    setError("We couldn't load your notes. Check your connection and try again.");
                }
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    const addNotes = async (event) => {
        event.preventDefault();
        const noteContent = content.trim();
        if (!noteContent) return;

        setIsSaving(true);
        setError("");
        try {
            await axios.post(`${API_BASE_URL}/notes/create`, { content: noteContent });
            setContent("");
            await getNotes();
        } catch {
            setError("Your note couldn't be saved. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteNotes = async (id) => {
        setDeletingId(id);
        setError("");
        try {
            await axios.delete(`${API_BASE_URL}/notes/delete/${id}`);
            setNotes((currentNotes) => currentNotes.filter((note) => note._id !== id));
        } catch {
            setError("That note couldn't be deleted. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredNotes = notes.filter((note) =>
        note.content.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <main className="app-shell">
            <aside className="sidebar">
                <div className="brand" aria-label="Noted">
                    <span className="brand-mark" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M7 3.75h7.5L19 8.3v11.95H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" />
                            <path d="M14 4v5h5M9 13h6M9 16.5h6" />
                        </svg>
                    </span>
                    <span>noted<span className="brand-period">.</span></span>
                </div>

                <div className="sidebar-section">
                    <p className="sidebar-label">YOUR SPACE</p>
                    <div className="nav-item nav-item-active">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 5.75A1.75 1.75 0 0 1 6.75 4h10.5A1.75 1.75 0 0 1 19 5.75v12.5A1.75 1.75 0 0 1 17.25 20H6.75A1.75 1.75 0 0 1 5 18.25V5.75Z" />
                            <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
                        </svg>
                        <span>All notes</span>
                        <span className="nav-count">{notes.length}</span>
                    </div>
                </div>

                <div className="sidebar-tip">
                    <span className="tip-sparkle" aria-hidden="true">✳</span>
                    <p className="tip-title">A little space to think.</p>
                    <p className="tip-copy">Capture the ideas you don’t want to lose.</p>
                </div>

                <div className="sidebar-footer">
                    <span className="status-dot" />
                    <span>Your thoughts, in one place</span>
                </div>
            </aside>

            <section className="workspace">
                <header className="topbar">
                    <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>All notes</strong></div>
                    <div className="topbar-date">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="4" y="5.5" width="16" height="15" rx="2" />
                            <path d="M8 3.5v4M16 3.5v4M4 10h16" />
                        </svg>
                        <span>{new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date())}</span>
                    </div>
                </header>

                <div className="page-content">
                    <section className="page-heading">
                        <div>
                            <p className="eyebrow">YOUR PERSONAL SPACE</p>
                            <h1>Good ideas start<br className="mobile-break" /> with a note<span>.</span></h1>
                            <p className="heading-subtitle">A quiet place for everything on your mind.</p>
                        </div>
                        <div className="note-total" aria-label={`${notes.length} notes`}>
                            <span className="total-number">{String(notes.length).padStart(2, "0")}</span>
                            <span className="total-label">{notes.length === 1 ? "NOTE" : "NOTES"}<br />SAVED</span>
                        </div>
                    </section>

                    <section className="composer-card" aria-labelledby="composer-title">
                        <div className="composer-heading">
                            <span className="composer-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </span>
                            <div>
                                <h2 id="composer-title">Capture a thought</h2>
                                <p>Write it down before it wanders off.</p>
                            </div>
                        </div>
                        <form onSubmit={addNotes}>
                            <label className="visually-hidden" htmlFor="note">Your note</label>
                            <textarea
                                id="note"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="What’s on your mind?"
                                rows="3"
                                maxLength="2000"
                            />
                            <div className="composer-actions">
                                <span className="character-count">{content.length} / 2000</span>
                                <button className="save-button" type="submit" disabled={!content.trim() || isSaving}>
                                    {isSaving ? "Saving…" : "Save note"}
                                    {!isSaving && (
                                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {error && (
                        <div className="error-message" role="alert">
                            <span>{error}</span>
                            {!isLoading && notes.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLoading(true);
                                        getNotes();
                                    }}
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    )}

                    <section className="notes-section" aria-labelledby="notes-title">
                        <div className="notes-toolbar">
                            <div className="notes-title-wrap">
                                <h2 id="notes-title">Your notes</h2>
                                <span className="notes-count">{notes.length}</span>
                            </div>
                            <label className="search-box">
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle cx="10.8" cy="10.8" r="6.3" />
                                    <path d="m15.5 15.5 4 4" />
                                </svg>
                                <span className="visually-hidden">Search notes</span>
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search notes"
                                />
                                {search && (
                                    <button
                                        className="clear-search"
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </label>
                        </div>

                        {isLoading ? (
                            <div className="loading-state" role="status">
                                <span className="loading-spinner" />
                                <span>Gathering your thoughts…</span>
                            </div>
                        ) : filteredNotes.length > 0 ? (
                            <div className="notes-grid">
                                {filteredNotes.map((note, index) => {
                                    const noteDate = note.createdAt ? new Date(note.createdAt) : null;
                                    const formattedDate = noteDate && !Number.isNaN(noteDate.getTime())
                                        ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(noteDate)
                                        : "Recently added";

                                    return (
                                        <article className={`note-card note-card-${index % 4}`} key={note._id}>
                                            <div className="note-card-top">
                                                <span className="note-date">
                                                    <span className="note-date-dot" />
                                                    {formattedDate}
                                                </span>
                                                <button
                                                    className="delete-button"
                                                    type="button"
                                                    onClick={() => deleteNotes(note._id)}
                                                    disabled={deletingId === note._id}
                                                    aria-label={`Delete note: ${note.content.slice(0, 40)}`}
                                                    title="Delete note"
                                                >
                                                    {deletingId === note._id ? (
                                                        <span className="delete-spinner" />
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                            <path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l.8 13h9.4l.8-13M9 7V4h6v3" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="note-content">{note.content}</p>
                                            <div className="note-card-footer">
                                                <span className="note-word-count">{note.content.trim().split(/\s+/).filter(Boolean).length} words</span>
                                                <span className="note-card-mark" aria-hidden="true">✳</span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-illustration" aria-hidden="true">
                                    <span className="empty-sun" />
                                    <span className="empty-paper"><i /><i /><i /></span>
                                    <span className="empty-sparkle">✳</span>
                                </div>
                                <h3>{search ? "No notes found" : "A fresh page"}</h3>
                                <p>{search ? "Try another search, or clear it to see all your notes." : "Your next great idea can go right here."}</p>
                                {search && <button className="text-button" type="button" onClick={() => setSearch("")}>Clear search</button>}
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}

export default Notes;
