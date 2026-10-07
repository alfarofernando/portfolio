import { useEffect, useState } from 'react';

/* eslint-disable react/prop-types -- Media values come from the checked-in local asset manifest. */
const ProjectMedia = ({ media, title, language, eager = false, compact = false }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [media?.src]);

  const frameClass = compact
    ? 'relative flex h-44 items-center justify-center overflow-hidden rounded-2xl'
    : 'relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl';

  if (!media?.src || failed) {
    return (
      <div className={`${frameClass} bg-gradient-to-br from-brand-700 via-brand-800 to-slate-950 px-6 text-center`}>
        <span className="text-xl font-semibold tracking-wide text-white">{title}</span>
      </div>
    );
  }

  return (
    <figure className="min-w-0">
      <div className={`${frameClass} ${media.kind === 'logo' ? 'bg-white p-5' : 'bg-neutral-100 dark:bg-slate-950/40'}`}>
        <img
          src={media.src}
          alt={media.alt?.[language] ?? title}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full ${media.fit === 'contain' || media.kind === 'logo' ? 'object-contain' : 'object-cover'}`}
        />
      </div>
      {!compact && media.caption?.[language] ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {media.caption[language]}
        </figcaption>
      ) : null}
    </figure>
  );
};

export default ProjectMedia;
