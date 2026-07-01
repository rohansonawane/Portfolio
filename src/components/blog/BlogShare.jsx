import { useState } from 'react';
import { SITE_URL } from '../../config/site';

function buildShareLinks(title, path) {
  const url = encodeURIComponent(`${SITE_URL}${path}`);
  const text = encodeURIComponent(title);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
    email: `mailto:?subject=${text}&body=${text}%0A%0A${url}`
  };
}

const ICONS = {
  link: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17 7h-1V6a4 4 0 0 0-8 0v1H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm-3 0H10V6a2 2 0 0 1 4 0v1z"
      />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 14 5a2.99 2.99 0 0 0 .04.49L7 9.6a3 3 0 1 0 0 4.8l7.05 4.11c-.03.16-.05.32-.05.49a3 3 0 1 0 3-2.92z"
      />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99-4.388 10.954-10.125 11.854v-8.385H7.078v-3.47h3.797V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  ),
  reddit: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
      />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
      />
    </svg>
  )
};

export default function BlogShare({ title, path, variant = 'icons' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${SITE_URL}${path}`;
  const links = buildShareLinks(title, path);
  const canNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: title, url: shareUrl });
    } catch {
      // User cancelled or share unavailable.
    }
  }

  if (variant === 'icons') {
    return (
      <div className="blog-share-icons">
        <span className="blog-share-icons-label">Share this article</span>
        <div className="blog-share-icons-row">
          <button
            type="button"
            className="blog-share-icon-btn"
            onClick={copyLink}
            aria-label={copied ? 'Link copied' : 'Copy link'}
            title={copied ? 'Copied!' : 'Copy link'}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : (
              ICONS.link
            )}
          </button>
          {canNativeShare && (
            <button
              type="button"
              className="blog-share-icon-btn"
              onClick={nativeShare}
              aria-label="Share"
              title="Share"
            >
              {ICONS.share}
            </button>
          )}
          <a className="blog-share-icon-btn" href={links.twitter} target="_blank" rel="noreferrer" aria-label="Share on X" title="X / Twitter">
            {ICONS.x}
          </a>
          <a className="blog-share-icon-btn" href={links.linkedin} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" title="LinkedIn">
            {ICONS.linkedin}
          </a>
          <a className="blog-share-icon-btn" href={links.facebook} target="_blank" rel="noreferrer" aria-label="Share on Facebook" title="Facebook">
            {ICONS.facebook}
          </a>
          <a className="blog-share-icon-btn" href={links.reddit} target="_blank" rel="noreferrer" aria-label="Share on Reddit" title="Reddit">
            {ICONS.reddit}
          </a>
          <a className="blog-share-icon-btn" href={links.email} aria-label="Share via email" title="Email">
            {ICONS.email}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
