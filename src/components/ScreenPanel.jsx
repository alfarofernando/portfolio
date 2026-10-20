/* eslint-disable react/prop-types -- Section content is defined by local route components. */
const ScreenPanel = ({ id, titleId, children, className = '', first = false, aliases = [] }) => (
  <section
    id={id}
    data-screen-panel
    data-screen-aliases={aliases.join(' ') || undefined}
    aria-labelledby={titleId}
    className={`screen-panel ${first ? 'screen-panel--first' : ''} ${className}`}
  >
    <div className="screen-panel__content">{children}</div>
  </section>
);

export default ScreenPanel;
