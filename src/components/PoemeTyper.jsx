import React, { useState, useEffect, useCallback } from 'react';
import { Feather, RefreshCw, X } from 'lucide-react';
import poemesData from '../data/poemes.json';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-amber-50 border border-rose-300 p-6 rounded-lg max-w-2xl w-full mx-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-rose-600 text-xl font-serif">{title}</h2>
          <button onClick={onClose} className="text-rose-500 hover:text-rose-400">
            <X />
          </button>
        </div>
        <div className="text-amber-900 font-serif">
          {children}
        </div>
      </div>
    </div>
  );
};

const PoemeTyper = () => {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [selectedPoeme, setSelectedPoeme] = useState(() => {
    const randomIndex = Math.floor(Math.random() * poemesData.poemes.length);
    return poemesData.poemes[randomIndex];
  });
  const [isTypingTitle, setIsTypingTitle] = useState(true);
  const [modalContent, setModalContent] = useState({ isOpen: false, title: '', content: '' });

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const handleKeyPress = useCallback((event) => {
    event.preventDefault();
    
    if (isTypingTitle) {
      if (titleIndex < selectedPoeme.titre.length) {
        setDisplayedTitle(current => current + selectedPoeme.titre[titleIndex]);
        setTitleIndex(current => current + 1);
      } else {
        setIsTypingTitle(false);
      }
    } else {
      if (textIndex < selectedPoeme.texte.length) {
        setDisplayedText(current => current + selectedPoeme.texte[textIndex]);
        setTextIndex(current => current + 1);
      }
    }
  }, [titleIndex, textIndex, selectedPoeme, isTypingTitle]);

  useEffect(() => {
    const keydownListener = (e) => {
      if (e.key === ' ' || e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }
      handleKeyPress(e);
    };
    window.addEventListener('keydown', keydownListener);
    return () => window.removeEventListener('keydown', keydownListener);
  }, [handleKeyPress]);

  const changePoeme = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * poemesData.poemes.length);
    } while (poemesData.poemes[newIndex].id === selectedPoeme.id);
    
    setSelectedPoeme(poemesData.poemes[newIndex]);
    setDisplayedTitle('');
    setDisplayedText('');
    setTitleIndex(0);
    setTextIndex(0);
    setIsTypingTitle(true);
  };

  const openModal = (title, content) => {
    setModalContent({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalContent({ ...modalContent, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8 font-serif flex flex-col pb-20">
      <div className="flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Feather className="w-6 h-6 text-rose-600" />
              <h1 className="text-2xl text-rose-700 font-semibold italic">PoèmeTyper</h1>
            </div>
            <button 
              onClick={changePoeme}
              className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg 
                       hover:bg-rose-200 transition-colors border border-rose-200 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Nouveau poème
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-200">
            <div className="mb-6 min-h-[2rem]">
              <h2 className="text-xl text-rose-600 font-medium">
                {displayedTitle}
                {isTypingTitle && <span 
                  className={`inline-block w-2 h-6 ml-1 relative top-1 ${cursorVisible ? 'bg-rose-400' : 'bg-transparent'}`}
                />}
              </h2>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-lg text-amber-900">
              {displayedText}
              {!isTypingTitle && <span 
                className={`inline-block w-2 h-6 ml-1 relative top-1 ${cursorVisible ? 'bg-rose-400' : 'bg-transparent'}`}
              />}
            </p>
          </div>
          
          <div className="mt-4 text-sm text-amber-700 text-center italic">
            Appuyez sur n'importe quelle touche pour continuer l'écriture {isTypingTitle ? "du titre" : "du poème"}...
          </div>
        </div>
      </div>

      {/* Navigation en bas de page */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-green-500 font-mono">
        <ul className="flex justify-center space-x-8 p-4 text-sm">
          <li>
            <button 
              onClick={() => openModal('Settings', 'Paramètres du PoèmeTyper')}
              className="text-green-500 hover:text-green-400"
            >
              Settings
            </button>
          </li>
          <li>
            <button 
              onClick={() => openModal('Help', 'Aide et instructions d\'utilisation')}
              className="text-green-500 hover:text-green-400"
            >
              Help
            </button>
          </li>
          <li>
            <button 
              onClick={() => openModal('About', 'À propos de PoèmeTyper\n\nCréé pour partager la poésie d\'une manière interactive et amusante.')}
              className="text-green-500 hover:text-green-400"
            >
              About
            </button>
          </li>
          <li>
            <button 
              onClick={() => openModal('Blog', 'Blog et actualités')}
              className="text-green-500 hover:text-green-400"
            >
              Blog
            </button>
          </li>
        </ul>
      </nav>

      <Modal 
        isOpen={modalContent.isOpen}
        onClose={closeModal}
        title={modalContent.title}
      >
        <div className="whitespace-pre-wrap">
          {modalContent.content}
        </div>
      </Modal>
    </div>
  );
};

export default PoemeTyper;
