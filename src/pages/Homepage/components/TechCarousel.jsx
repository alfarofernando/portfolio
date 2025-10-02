import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext.jsx';

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

const stackConfig = [
  { key: 'html', icon: HtmlIcon },
  { key: 'css', icon: CssIcon },
  { key: 'bootstrap', icon: BootstrapIcon },
  { key: 'javascript', icon: JsIcon },
  { key: 'react', icon: ReactIcon },
  { key: 'tailwind', icon: TailwindIcon },
  { key: 'php', icon: PhpIcon },
  { key: 'node', icon: NodeIcon },
  { key: 'express', icon: ExpressIcon },
  { key: 'mongodb', icon: MongoIcon },
  { key: 'mysql', icon: MySqlIcon },
  { key: 'git', icon: GitIcon },
  { key: 'github', icon: GithubIcon },
  { key: 'vite', icon: ViteIcon },
];

const TechCarousel = () => {
  const { language, locales } = useLanguage();
  const labels = locales[language].techStack;

  const items = useMemo(
    () => stackConfig.map((item) => ({ ...item, name: labels[item.key] })),
    [labels]
  );

  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex min-w-max gap-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, repeatType: 'loop', duration: 18, ease: 'linear' }}
      >
        {duplicatedItems.map(({ name, icon }, index) => (
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
