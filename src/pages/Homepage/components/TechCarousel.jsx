import { useMemo } from 'react';
import { motion } from 'framer-motion';

import HtmlIcon from '../../../assets/icons/html-5.svg';
import CssIcon from '../../../assets/icons/css.svg';
import BootstrapIcon from '../../../assets/icons/bootstrap.svg';
import JsIcon from '../../../assets/icons/javascript.svg';
import ReactIcon from '../../../assets/icons/react.svg';
import TailwindIcon from '../../../assets/icons/tailwind.svg';
import PhpIcon from '../../../assets/icons/php.svg';
import NodeIcon from '../../../assets/icons/node.svg';
import ExpressIcon from '../../../assets/icons/express.svg';
import MongoIcon from '../../../assets/icons/mongo.svg';
import MySqlIcon from '../../../assets/icons/mysql.svg';
import GitIcon from '../../../assets/icons/git.svg';
import GithubIcon from '../../../assets/icons/github.svg';
import ViteIcon from '../../../assets/icons/vite.svg';

const techStack = [
  { name: 'HTML', icon: HtmlIcon },
  { name: 'CSS', icon: CssIcon },
  { name: 'Bootstrap', icon: BootstrapIcon },
  { name: 'JavaScript', icon: JsIcon },
  { name: 'React', icon: ReactIcon },
  { name: 'Tailwind', icon: TailwindIcon },
  { name: 'PHP', icon: PhpIcon },
  { name: 'Node.js', icon: NodeIcon },
  { name: 'Express', icon: ExpressIcon },
  { name: 'MongoDB', icon: MongoIcon },
  { name: 'MySQL', icon: MySqlIcon },
  { name: 'Git', icon: GitIcon },
  { name: 'GitHub', icon: GithubIcon },
  { name: 'Vite', icon: ViteIcon },
];

const TechCarousel = () => {
  const items = useMemo(() => [...techStack, ...techStack], []);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex min-w-max gap-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, repeatType: 'loop', duration: 18, ease: 'linear' }}
      >
        {items.map(({ name, icon }, index) => (
          <div
            key={`${name}-${index}`}
            className="flex min-w-[120px] flex-col items-center gap-2 rounded-3xl border border-brand-100 bg-white/80 px-4 py-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md dark:border-brand-500/20 dark:bg-slate-900/60"
          >
            <img src={icon} alt={name} className="h-10 w-10" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-200">{name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechCarousel;