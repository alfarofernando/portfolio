import { Link, Route, Routes } from 'react-router-dom';
import ProjectPage from '../pages/Projects/components/ProjectPage';
import PortfolioLanding from '../pages/Homepage/PortfolioLanding';
import ProjectCatalog from '../pages/Projects/ProjectCatalog.jsx';
import Experience from '../pages/Experience/Experience.jsx';
import Solutions from '../pages/Solutions/Solutions.jsx';
import RouteEffects from '../components/RouteEffects.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const NotFound = () => {
  const { language, locales } = useLanguage();
  const copy = locales[language].seo.pages.notFound;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white">{copy.title}</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">{copy.description}</p>
      <Link
        to="/portfolio/"
        className="mt-8 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        {locales[language].nav.home}
      </Link>
    </section>
  );
};

const Router = () => {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/portfolio/" element={<PortfolioLanding />} />
        <Route path="/portfolio/Home" element={<PortfolioLanding />} />
        <Route path="/portfolio/Projects" element={<PortfolioLanding />} />
        <Route path="/portfolio/AboutMe" element={<PortfolioLanding />} />
        <Route path="/portfolio/Experience" element={<Experience />} />
        <Route path="/portfolio/Solutions" element={<Solutions />} />
        <Route path="/portfolio/Projects/all" element={<ProjectCatalog />} />
        <Route path="/portfolio/Projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Router;
