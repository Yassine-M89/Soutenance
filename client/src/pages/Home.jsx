import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import assistanceImg from '../assets/assistance.jpg';
import livraisonImg from '../assets/livraison.jpg';
import materielRecentImg from '../assets/materiel_recent.jpg';

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselSlides = [
    {
      id: 1,
      image: materielRecentImg,
      title: "Matériel Récent & De Haute Qualité",
      description: "Découvrez notre large gamme d'équipements informatiques et high-tech de dernière génération."
    },
    {
      id: 2,
      image: livraisonImg,
      title: "Livraison Rapide & Sécurisée",
      description: "Profitez d'une livraison à domicile rapide partout en Tunisie."
    },
    {
      id: 3,
      image: assistanceImg,
      title: "Assistance Client 24/7",
      description: "Notre équipe support est toujours disponible pour vous conseiller et vous guider."
    }
  ];

  // Défilement automatique toutes les 4 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="home-page container my-3" style={{ maxWidth: '950px' }}>
      
      {/* 1. BLOC BIENVENUE AVEC TITRE ET PARAGRAPHE EN NOIR */}
      <section className="text-center py-3 mb-3">
        <h1 className="fw-bold mb-2 fs-2 text-dark">Bienvenue sur Tech Store</h1>
        <p className="lead fs-6 mb-3 text-dark fw-normal">
          Trouvez tous vos équipements informatiques au meilleur prix.
        </p>
        <Link to="/boutique" className="btn btn-primary btn-md fw-bold px-4 shadow-sm">
          Découvrir nos produits 🛍️
        </Link>
      </section>

      {/* 2. CARROUSEL COMPACT */}
      <section className="mb-3">
        <div className="carousel slide shadow-sm rounded-3 overflow-hidden" style={{ position: 'relative' }}>
          
          {/* Indicateurs */}
          <div className="carousel-indicators">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>

          {/* Diapositives */}
          <div className="carousel-inner">
            {carouselSlides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`carousel-item ${index === activeIndex ? "active" : ""}`}
              >
                <div style={{ position: 'relative', height: '320px', width: '100%', backgroundColor: 'transparent' }}>
                  <img
                    src={slide.image}
                    className="d-block w-100 h-100"
                    alt={slide.title}
                    style={{ objectFit: 'cover', opacity: 1 }}
                  />
                  
                  {/* Légende du carrousel avec fond transparent */}
                  <div 
                    className="carousel-caption d-none d-md-block p-3 rounded mb-2"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      backdropFilter: 'blur(3px)',
                      textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    <h5 className="fw-bold text-white mb-1 fs-5">{slide.title}</h5>
                    <p className="mb-0 small text-white-50">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boutons Suivant / Précédent */}
          <button
            className="carousel-control-prev"
            type="button"
            onClick={handlePrev}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Précédent</span>
          </button>
          
          <button
            className="carousel-control-next"
            type="button"
            onClick={handleNext}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Suivant</span>
          </button>
        </div>
      </section>

    </div>
  );
}

export default Home;