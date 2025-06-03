import React from 'react';
import { Link } from 'react-router-dom';

export interface FooterLink {
  text: string;
  path: string;
  external?: boolean;
}

export interface FooterLinkColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ title, links }) => (
  <div>
    <h5 className="font-semibold text-xs text-gray-700 dark:text-gray-200">
      {title}
    </h5>
    <ul>
      {links.map((link) => (
        <li key={link.text}>
          {link.external ? (
            <a
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
            >
              {link.text}
            </a>
          ) : (
            <Link
              to={link.path}
              className="text-xs text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
            >
              {link.text}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default FooterLinkColumn;