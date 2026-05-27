import { Route, Routes } from 'react-router-dom';
import ProjectPage from '../pages/Projects/components/ProjectPage';
import PortfolioLanding from '../pages/Homepage/PortfolioLanding';

const Router = () => {
  return (
    <Routes>
      <Route path="/portfolio/" element={<PortfolioLanding />} />
      <Route path="/portfolio/Home" element={<PortfolioLanding />} />
      <Route path="/portfolio/Projects" element={<PortfolioLanding />} />
      <Route path="/portfolio/AboutMe" element={<PortfolioLanding />} />
      <Route path="/portfolio/Projects/:slug" element={<ProjectPage />} />
    </Routes>
  );
};

export default Router;
