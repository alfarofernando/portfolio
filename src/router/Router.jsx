import { Route, Routes } from 'react-router-dom';
import ProjectPage from '../pages/Projects/components/ProjectPage';
import PortfolioLanding from '../pages/Homepage/PortfolioLanding';
import ProjectCatalog from '../pages/Projects/ProjectCatalog.jsx';
import Experience from '../pages/Experience/Experience.jsx';

const Router = () => {
  return (
    <Routes>
      <Route path="/portfolio/" element={<PortfolioLanding />} />
      <Route path="/portfolio/Home" element={<PortfolioLanding />} />
      <Route path="/portfolio/Projects" element={<PortfolioLanding />} />
      <Route path="/portfolio/AboutMe" element={<PortfolioLanding />} />
      <Route path="/portfolio/Experience" element={<Experience />} />
      <Route path="/portfolio/Projects/all" element={<ProjectCatalog />} />
      <Route path="/portfolio/Projects/:slug" element={<ProjectPage />} />
    </Routes>
  );
};

export default Router;
