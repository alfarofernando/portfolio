import { useLanguage } from '../context/LanguageContext.jsx';
import { useScreenScroll } from '../context/ScreenScrollContext.jsx';

/* eslint-disable react/prop-types -- Panel content is defined by local route components. */
const ScreenPanel = ({ id, titleId, children, className = '', first = false, aliases = [] }) => {
  const { language, locales } = useLanguage();
  const { movePanel, activePanelId, panelIds } = useScreenScroll();
  const copy = locales[language].screenNavigation;
  const index = panelIds.indexOf(id);
  const isActive = activePanelId === id;

  return (
    <section
      id={id}
      data-screen-panel
      data-screen-aliases={aliases.join(' ') || undefined}
      aria-labelledby={titleId}
      className={`screen-panel ${first ? 'screen-panel--first' : ''} ${className}`}
    >
      <div className="screen-panel__content">{children}</div>
      <nav className="screen-panel__controls" aria-label={copy.panelControls}>
        <button type="button" onClick={() => movePanel(-1, { focus: true })} disabled={index <= 0} aria-label={copy.previousPanel}>
          <span aria-hidden="true">↑</span><span>{copy.previousPanel}</span>
        </button>
        <span className="screen-panel__position" aria-live="polite">
          {index >= 0 ? copy.position.replace('{current}', String(index + 1)).replace('{total}', String(panelIds.length)) : null}
        </span>
        <button type="button" onClick={() => movePanel(1, { focus: true })} disabled={index < 0 || index >= panelIds.length - 1} aria-label={copy.nextPanel}>
          <span>{copy.nextPanel}</span><span aria-hidden="true">↓</span>
        </button>
        <span className="sr-only">{isActive ? copy.currentPanel : ''}</span>
      </nav>
    </section>
  );
};

export default ScreenPanel;
