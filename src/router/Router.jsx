import { Route, Routes } from 'react-router-dom';
import ProjectPage from '../pages/Projects/components/ProjectPage';
import Welcome from '../pages/Homepage/Welcome';
import Projects from '../pages/Projects/Projects';
import AboutMe from '../pages/AboutMe/AboutMe';

const Router = () => {
  return (
    <Routes>
      <Route path="/portfolio/" element={<Welcome />} />
      <Route path="/portfolio/Home" element={<Welcome />} />
      <Route path="/portfolio/Projects" element={<Projects />} />
      <Route path="/portfolio/AboutMe" element={<AboutMe />} />
      <Route path="/portfolio/Projects/:slug" element={<ProjectPage />} />
    </Routes>
  );
};

export default Router;
