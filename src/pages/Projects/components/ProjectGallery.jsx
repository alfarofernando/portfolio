/* eslint-disable react/prop-types -- The existing React components in this project use direct props without runtime schemas. */
import { useEffect, useRef, useState } from 'react';

const fillSlideLabel = (template, current, total) =>
  template.replace('{current}', String(current)).replace('{total}', String(total));

const ProjectGallery = ({ items, projectTitle, copy }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  const thumbnailNavigationRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const navigation = thumbnailNavigationRef.current;
    const thumbnail = thumbnailRefs.current[activeIndex];
    if (!navigation || !thumbnail) return;

    const navigationBounds = navigation.getBoundingClientRect();
    const thumbnailBounds = thumbnail.getBoundingClientRect();
    const leftBoundary = navigationBounds.left + 8;
    const rightBoundary = navigationBounds.right - 8;

    if (thumbnailBounds.left < leftBoundary) {
      navigation.scrollBy({ left: thumbnailBounds.left - leftBoundary });
    } else if (thumbnailBounds.right > rightBoundary) {
      navigation.scrollBy({ left: thumbnailBounds.right - rightBoundary });
    }
  }, [activeIndex]);

  if (!items?.length) return null;

  const hasMultipleSlides = items.length > 1;
  const activeItem = items[activeIndex];
  const slideAnnouncement = fillSlideLabel(copy.gallerySlideAnnouncement, activeIndex + 1, items.length);

  const moveSlide = (direction) => {
    setActiveIndex((currentIndex) => (currentIndex + direction + items.length) % items.length);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveSlide(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveSlide(1);
    }
  };

  const handleTouchEnd = (event) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX === null || typeof endX !== 'number' || Math.abs(startX - endX) < 48) return;
    moveSlide(startX > endX ? 1 : -1);
  };

  return (
    <div className="w-full" role="region" aria-label={`${projectTitle}: ${copy.galleryLabel}`}>
      <figure
        className="project-gallery__frame"
        role="group"
        aria-roledescription={copy.gallerySlideRoleDescription}
        aria-label={`${projectTitle}, ${slideAnnouncement}`}
        tabIndex={hasMultipleSlides ? 0 : undefined}
        aria-keyshortcuts={hasMultipleSlides ? 'ArrowLeft ArrowRight' : undefined}
        onKeyDown={hasMultipleSlides ? handleKeyDown : undefined}
        onTouchStart={hasMultipleSlides ? (event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        } : undefined}
        onTouchEnd={hasMultipleSlides ? handleTouchEnd : undefined}
      >
        <img
          src={activeItem.original}
          alt={activeItem.originalAlt ?? `${projectTitle} ${copy.previewAltLabel} ${activeIndex + 1}`}
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
          className="project-gallery__image"
        />

        {hasMultipleSlides && (
          <>
            <button
              type="button"
              className="project-gallery__nav project-gallery__nav--previous"
              aria-label={copy.galleryPrevious}
              onClick={() => moveSlide(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="project-gallery__nav project-gallery__nav--next"
              aria-label={copy.galleryNext}
              onClick={() => moveSlide(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        )}
      </figure>

      {hasMultipleSlides && (
        <>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {slideAnnouncement}
          </p>
          <nav
            ref={thumbnailNavigationRef}
            className="project-gallery__thumbnails"
            aria-label={copy.galleryThumbnailNavigation}
          >
            {items.map((item, index) => (
              <button
                key={item.key ?? item.thumbnail ?? index}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                className="project-gallery__thumbnail"
                aria-label={fillSlideLabel(copy.galleryGoToSlide, index + 1, items.length)}
                aria-pressed={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                <img src={item.thumbnail ?? item.original} alt="" loading="lazy" />
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
};

export default ProjectGallery;
