import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import HLSPlayer from "@/components/HLSPlayer";
import { PHYSICS_VIDEOS } from "@/data/videos";

function Watch() {
  const [theme, setTheme] = useState("light");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = parseInt(searchParams.get("v"));

  const currentVideo = useMemo(() => {
    return PHYSICS_VIDEOS.find(v => v.id === videoId);
  }, [videoId]);

  const relatedVideos = useMemo(() => {
    if (!currentVideo) return [];
    return PHYSICS_VIDEOS.filter(
      v => v.category === currentVideo.category && v.id !== currentVideo.id
    );
  }, [currentVideo]);

  const categoryVideos = useMemo(() => {
    if (!currentVideo) return [];
    return PHYSICS_VIDEOS.filter(v => v.category === currentVideo.category);
  }, [currentVideo]);

  const currentIndex = useMemo(() => {
    return categoryVideos.findIndex(v => v.id === videoId);
  }, [categoryVideos, videoId]);

  const previousVideo = currentIndex > 0 ? categoryVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < categoryVideos.length - 1 ? categoryVideos[currentIndex + 1] : null;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!currentVideo) {
    return (
      <div className="app">
        <div className="watch-error">
          <h2>Video not found</h2>
          <Link to="/" className="back-link">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header" data-testid="watch-header">
        <div className="watch-header-content">
          <button
            onClick={() => navigate("/")}
            className="watch-back-btn"
            data-testid="watch-back-btn"
            aria-label="Back to home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="watch-header-left">
            <div className="app-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h1 className="watch-logo" data-testid="watch-logo">PRO STREAM</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            data-testid="watch-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="watch-content">
        {/* Video Player Section with Custom Controls */}
        <div className="video-player-section">
          <div className="custom-video-container">
            <HLSPlayer
              src={currentVideo.videoUrl}
              autoPlay={true}
              className="video-player"
            />
            
            {/* Custom Navigation Overlay Inside Player */}
            <div className="custom-player-controls">
              {previousVideo && (
                <Link
                  to={`/watch?v=${previousVideo.id}`}
                  className="player-nav-btn prev-player-btn"
                  data-testid="prev-video-btn"
                  title="Previous Video"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </Link>
              )}
              {nextVideo && (
                <Link
                  to={`/watch?v=${nextVideo.id}`}
                  className="player-nav-btn next-player-btn"
                  data-testid="next-video-btn"
                  title="Next Video"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Video Title and Notes in Single Container */}
        <div className="video-title-container">
          <h1 className="video-page-title" data-testid="video-page-title">{currentVideo.title}</h1>
          {currentVideo.notesLink && (
            <a
              href={currentVideo.notesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="notes-icon-only"
              data-testid="notes-icon-btn"
              title="View Notes"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </a>
          )}
        </div>

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <div className="related-videos-section">
            <h2 className="section-title" data-testid="related-section-title">
              More from {currentVideo.category}
            </h2>
            <div className="related-grid" data-testid="related-videos-grid">
              {relatedVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/watch?v=${video.id}`}
                  className="related-card"
                  data-testid={`related-card-${video.id}`}
                >
                  <div className="related-thumbnail-container">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="related-thumbnail"
                      loading="lazy"
                    />
                    <div className="play-overlay">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <span className="duration-badge">{video.duration}</span>
                  </div>
                  <div className="related-info">
                    <h3 className="related-title" data-testid={`related-title-${video.id}`}>
                      {video.title}
                    </h3>
                    {video.notesLink && (
                      <button
                        className="related-notes-icon"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(video.notesLink, "_blank");
                        }}
                        data-testid={`related-notes-${video.id}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Watch;
