import React, { useState, useRef, useEffect } from 'react';
import FooterLinkColumn, { FooterLink } from '../components/footer/FooterLinkColumn';
import { ChevronDownIcon, ChevronUpIcon } from '../icons';

const AppFooter: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  const handleToggleShowMore = () => {
    setShowMore(prevShowMore => !prevShowMore);
  };

  useEffect(() => {
    if (showMore && footerRef.current) {
      const timer = setTimeout(() => {
        if (footerRef.current) {
          footerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [showMore]);

  const colPrincipios: FooterLink[] = [
    { text: 'Usabilidade Essencial', path: '/ihc/usabilidade' },
    { text: 'Acessibilidade em Foco', path: '/ihc/acessibilidade-web' },
  ];
  const colRecursos: FooterLink[] = [
    { text: 'Guias Rápidos de IHC', path: '/recursos/guias' },
    { text: 'Ferramentas Chave', path: '/ferramentas/essenciais' },
  ];
  const colSobre: FooterLink[] = [
    { text: 'Sobre o Projeto', path: '/sobre-projeto-ihc' },
    { text: 'Contato da Equipe', path: '/contato-equipe-ihc' },
  ];

  return (
    <footer
      ref={footerRef}
      className="
        bg-gray-100 text-gray-700
        dark:bg-gray-800 dark:text-gray-300
        border-t border-gray-200 dark:border-gray-700
      "
    >
      <div className="container mx-auto px-2 py-2">

        <div className="relative text-center mb-3">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
          <button
            onClick={handleToggleShowMore}
            className="
              relative z-10 inline-flex items-center
              px-4 py-1.5 text-xs
              bg-gray-100 dark:bg-gray-800
              rounded hover:bg-gray-200 dark:hover:bg-gray-700
              text-gray-600 dark:text-gray-200
              transition-colors duration-200 ease-in-out
            "
            aria-expanded={showMore}
            aria-controls="footer-link-columns"
          >
            Mais informações
            {showMore
              ? <ChevronDownIcon className="ml-1.5 size-3.5" />
              : <ChevronUpIcon className="ml-1.5 size-3.5" />
            }
          </button>
        </div>

        <div
          id="footer-link-columns"
          className={`
            grid sm:grid-cols-3 gap-x-4 gap-y-1
            overflow-hidden transition-all duration-500 ease-out {/* Mudado para ease-out */}
            ${showMore
              // Estilos para o estado ABERTO
              ? 'max-h-96 py-3 opacity-100 border-b border-gray-200 dark:border-gray-600 mb-3'
              // Estilos para o estado FECHADO
              : 'max-h-0 py-0 opacity-0 mb-0 pointer-events-none border-b border-transparent' /* Adicionado border-b border-transparent */
            }
          `}
        >
          <>
            <FooterLinkColumn title="Princípios IHC" links={colPrincipios} />
            <FooterLinkColumn title="Recursos" links={colRecursos} />
            <FooterLinkColumn title="Sobre" links={colSobre} />
          </>
        </div>

        <div className="text-center text-[10px] leading-tight text-gray-500 dark:text-gray-400 pt-1">
          <p className="mt-0.5">
            &copy; {currentYear} Dashboard IHC. Todos os direitos reservados. Desenvolvido por: Jonas & Francisco & Paulo.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;