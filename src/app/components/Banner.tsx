function Banner() {
  return (
    <a
      target="_blank"
      data-analytics="learn-more-about-ae-link"
      className="flex h-11 items-center justify-center gap-4 bg-gray-700 p-3 text-xs md:flex-row md:gap-1 md:text-sm"
      href="https://ae.studio/ai-solutions?utm_source=sds&amp;utm_medium=referral&amp;utm_campaign=focusreminder&amp;utm_content=top-bar&amp;utm_term=3ff5251a-e107-4d47-bfb8-b2962debd252"
      rel="noreferrer"
    >
      <span className="font-medium">
        Made with 🧡 by <span className="font-semibold underline">AE Studio</span>
      </span>
      <span className="hidden md:inline-block">•</span>
      <span className="hidden md:inline-block">See what we could build for you</span>
      <div className="hidden md:inline-block">
        <span className="font-semibold underline">Learn more →</span>
      </div>
    </a>
  );
}

export default Banner;
