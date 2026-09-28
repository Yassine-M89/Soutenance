import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données envoyées :', formData);
    setSubmitted(true);
    setFormData({ nom: '', email: '', message: '' });
  };

  return (
    <div className="container my-3" style={{ maxWidth: '950px' }}>
      <div className="row g-3 align-items-stretch">
        
        {/* Colonne Gauche : Formulaire de contact compact */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm p-3 h-100">
            <h3 className="mb-3 text-center fw-bold fs-4">Contactez-nous</h3>

            {submitted && (
              <div className="alert alert-success alert-dismissible fade show p-2 fs-6 mb-3" role="alert">
                Message envoyé avec succès !
                <button 
                  type="button" 
                  className="btn-close p-2" 
                  onClick={() => setSubmitted(false)}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="nom" className="form-label fw-semibold small mb-1">Nom :</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="email" className="form-label fw-semibold small mb-1">Email :</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre.email@example.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-semibold small mb-1">Message :</label>
                <textarea
                  className="form-control form-control-sm"
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Écrivez votre message ici..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-sm w-100 py-2 fw-bold">
                Envoyer
              </button>
            </form>

            <hr className="my-3" />

            {/* Coordonnées réduites */}
            <div className="small">
              <h6 className="fw-bold mb-2 fs-6">Nos Coordonnées</h6>
              <p className="mb-1 text-muted">📍 <strong>Adresse :</strong> Tunis, Tunisie</p>
              <p className="mb-1 text-muted">📞 <strong>Téléphone :</strong> +216 71 000 000</p>
              <p className="mb-0 text-muted">✉️ <strong>Email :</strong> contact@techstore.tn</p>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Carte Google Maps compacte */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm p-1 h-100">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102239.38283307613!2d10.100532297265625!3d36.80649480000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px', borderRadius: '6px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;