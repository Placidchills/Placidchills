"use client";

export function BeatToast({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <div id="beat-toast" className={show ? "show" : ""} role="status" aria-live="polite">
      <div className="toast-body">
        <div className="toast-title">Sounds good?</div>
        <div className="toast-text">Lock in the lease before someone else does.</div>
        <a
          href="/licensing"
          className="toast-link"
          onClick={onClose}
        >
          See licensing options →
        </a>
      </div>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
