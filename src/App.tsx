import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Menu, 
  X,
  Star,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { CITIES, SERVICES, TESTIMONIALS, COMPANY_PHONE } from './constants';
import AIChatAssistant from './components/AIChatAssistant';
import StickyCallBtn from './components/StickyCallBtn';

const App = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [isLandingPageMode, setIsLandingPageMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const formRef = useRef<HTMLFormElement>(null);

  // Detection du mode Landing Page via URL (ex: ?city=Namur)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    
    if (cityParam) {
      // Normalisation pour la recherche (retirer accents si besoin, mais ici simple match)
      const foundCity = CITIES.find(c => c.name.toLowerCase() === cityParam.toLowerCase());
      if (foundCity) {
        setSelectedCity(foundCity);
        setIsLandingPageMode(true);
        document.title = `Débouchage ${foundCity.name} - Urgence 24/7 | Hydro Débouchage`;
      }
    }
  }, []);

  // Handle Contact Form Submit with EmailJS
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    if (!formRef.current) return;

    // REMPLACEZ CES VALEURS PAR LES VÔTRES DEPUIS EMAILJS
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
      publicKey: PUBLIC_KEY,
    })
    .then(() => {
      setFormStatus('success');
      // Reset after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
      if (formRef.current) formRef.current.reset();
    }, (error) => {
      console.error('FAILED...', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    });
  };

  // Filtrer les avis pour afficher ceux de la région en premier si possible
  const sortedTestimonials = [...TESTIMONIALS].sort((a, b) => {
    if (a.location === selectedCity.name) return -1;
    if (b.location === selectedCity.name) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar - Trust Signals */}
      <div className="bg-slate-900 text-white py-2 px-4 text-sm hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-green-400">
              <Clock className="w-4 h-4" /> Intervention en 30 min à {selectedCity.name}
            </span>
            <span className="flex items-center gap-2 text-blue-300">
              <ShieldCheck className="w-4 h-4" /> Garantie 1 an
            </span>
            <span className="flex items-center gap-2 text-orange-300">
              <CheckCircle2 className="w-4 h-4" /> Devis Gratuit
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isLandingPageMode ? (
              // En mode LP, on affiche statiquement pour renforcer l'aspect local
              <span className="flex items-center gap-1 font-bold text-blue-200">
                <MapPin className="w-3 h-3" /> Agence locale : {selectedCity.name} ({selectedCity.zip})
              </span>
            ) : (
              <>
                <span>Intervention partout en Wallonie :</span>
                <select 
                  value={selectedCity.name}
                  onChange={(e) => {
                    const city = CITIES.find(c => c.name === e.target.value);
                    if(city) setSelectedCity(city);
                  }}
                  className="bg-slate-800 border-none text-white text-sm rounded focus:ring-2 focus:ring-blue-500 py-1"
                >
                  {CITIES.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Header / Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                HYDRO<span className="text-blue-600">DÉBOUCHAGE</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">
                {isLandingPageMode ? selectedCity.name : 'Wallonie'}
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">À Propos</a>
            <a href="#avis" className="hover:text-blue-600 transition-colors">Avis Clients</a>
            <a 
              href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-200 hover:shadow-red-300 transition-all flex items-center gap-2 animate-pulse-slow"
            >
              <Phone className="w-5 h-5" />
              {COMPANY_PHONE}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="flex flex-col p-4 space-y-4 font-medium text-lg text-center">
               <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
               <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>À Propos</a>
               <a href="#avis" onClick={() => setIsMobileMenuOpen(false)}>Avis</a>
               <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="text-red-600 font-bold bg-red-50 py-3 rounded-lg">
                 URGENCE : {COMPANY_PHONE}
               </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 opacity-10 -skew-x-12 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-1 text-sm font-medium mb-6 text-blue-200">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Techniciens disponibles maintenant à {selectedCity.name}
              </div>
              
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Débouchage urgent <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  à {selectedCity.name}
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg mx-auto md:mx-0">
                WC, évier, égout bouché ? Notre équipe locale intervient en moins de 30 minutes. Prix transparents et devis gratuit.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <a 
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Phone className="w-6 h-6" />
                  Appeler {selectedCity.name}
                </a>
                <a 
                  href="#contact"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3"
                >
                  Demander un devis
                </a>
              </div>
            </div>

            {/* Right Content - Service Card */}
            <div className="w-full md:w-[450px]">
              <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-xl">Pourquoi choisir Hydro Débouchage {selectedCity.name} ?</h3>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold">Intervention Express</h4>
                      <p className="text-sm text-slate-500">Arrivée rapide à {selectedCity.name} et environs.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold">Prix Fixe Garanti</h4>
                      <p className="text-sm text-slate-500">Pas de surprise, le devis est validé avant travaux.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600 mt-1">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold">Garantie Satisfaction</h4>
                      <p className="text-sm text-slate-500">Débouché ou remboursé.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Services de Débouchage à {selectedCity.name}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Équipés des dernières technologies (caméra, haute pression), nos techniciens locaux résolvent tous vos problèmes sanitaires à {selectedCity.name} et dans la région de {selectedCity.region}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>
                <a href="#contact" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800">
                  Demander un devis <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Une urgence à {selectedCity.name} ?</h2>
            <p className="text-blue-200">Notre camion est probablement déjà dans votre quartier. Appelez maintenant.</p>
          </div>
          <a 
            href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
            className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-3 whitespace-nowrap"
          >
            <Phone className="w-6 h-6" />
            {COMPANY_PHONE}
          </a>
        </div>
      </section>

      {/* LOCATION & SOCIAL PROOF */}
      <section id="avis" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Reviews - Sorted to show local reviews first */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold mb-10 text-slate-900">Avis clients {selectedCity.name}</h2>
              <div className="space-y-6">
                {sortedTestimonials.slice(0, 3).map((t) => (
                  <div key={t.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-1 text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-slate-700 italic mb-4">"{t.text}"</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">{t.name}</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {t.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder / Service Area */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold mb-6 text-slate-900">
                {isLandingPageMode ? `Intervention à ${selectedCity.name} et quartiers` : `Zone d'intervention`}
              </h2>
              <p className="mb-6 text-slate-600">
                Nous couvrons tout {selectedCity.name} ({selectedCity.zip}) et arrivons généralement en moins de 30 minutes.
              </p>
              <div className="bg-slate-200 w-full h-80 rounded-2xl flex items-center justify-center relative overflow-hidden group mb-6">
                 {/* Fake Map Visual */}
                 <div className="absolute inset-0 bg-[url('https://picsum.photos/800/600?grayscale')] bg-cover opacity-50 mix-blend-multiply"></div>
                 <div className="relative z-10 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="bg-red-500 text-white p-2 rounded-full animate-bounce">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Équipe technique {selectedCity.name}</div>
                      <div className="text-xs text-green-600 font-bold">Statut : En service</div>
                    </div>
                 </div>
              </div>
              
              {isLandingPageMode && selectedCity.neighborhoods ? (
                // Display specific neighborhoods if available to look HYPER LOCAL
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Nous intervenons dans tous les quartiers :</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCity.neighborhoods.map(hood => (
                      <span key={hood} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                        {hood}
                      </span>
                    ))}
                    <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                      Centre-ville
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full border border-slate-200">
                      Périphérie
                    </span>
                  </div>
                </div>
              ) : (
                // Default view showing other cities
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500 font-medium">
                    {CITIES.slice(0, 8).map(c => (
                      <div key={c.name} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer" onClick={() => setSelectedCity(c)}>
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> {c.name}
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-20 bg-slate-900 text-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            <div className="p-10 md:w-1/2 bg-blue-700">
              <h3 className="text-2xl font-bold mb-4">Devis gratuit {selectedCity.name}</h3>
              <p className="text-blue-100 mb-8">
                Remplissez ce formulaire. Un technicien de la région de {selectedCity.name} vous rappelle dans les 5 minutes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>Rappel immédiat</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span>Aucun engagement</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span>Service 24h/24</span>
                </li>
              </ul>
            </div>

            <div className="p-10 md:w-1/2 bg-white text-slate-900">
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Demande envoyée !</h4>
                  <p className="text-slate-600">Un technicien local ({selectedCity.name}) va vous rappeler.</p>
                </div>
              ) : formStatus === 'error' ? (
                 <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <X className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Erreur technique</h4>
                  <p className="text-slate-600 mb-4">Le formulaire n'a pas pu être envoyé.</p>
                  <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="text-blue-600 font-bold underline">Appeler directement le {COMPANY_PHONE}</a>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nom complet</label>
                    <input name="user_name" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Téléphone</label>
                    <input name="user_phone" required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="04XX..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Ville d'intervention</label>
                    {isLandingPageMode ? (
                       <input 
                         name="user_city"
                         readOnly // Use readOnly instead of disabled for form submission
                         value={`${selectedCity.name} (${selectedCity.zip})`}
                         className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-lg px-4 py-3 cursor-not-allowed"
                       />
                    ) : (
                      <select 
                        name="user_city"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={selectedCity.name}
                        onChange={(e) => {
                           const c = CITIES.find(ci => ci.name === e.target.value);
                           if(c) setSelectedCity(c);
                        }}
                      >
                        {CITIES.map(c => <option key={c.name} value={c.name}>{c.name} ({c.zip})</option>)}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Problème</label>
                    <select name="user_problem" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option>WC Bouché</option>
                      <option>Évier / Lavabo</option>
                      <option>Égouts</option>
                      <option>Mauvaises odeurs</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {formStatus === 'submitting' ? 'Envoi en cours...' : 'M\'appeler maintenant'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800 pb-24 md:pb-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Hydro Débouchage {selectedCity.name}</h4>
            <p className="mb-4">Votre partenaire local de confiance pour tous travaux d'assainissement et de débouchage.</p>
            <div className="flex items-center gap-2 text-white">
              <Phone className="w-4 h-4" /> {COMPANY_PHONE}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Débouchage WC</a></li>
              <li><a href="#" className="hover:text-white">Curage égouts</a></li>
              <li><a href="#" className="hover:text-white">Inspection caméra</a></li>
              <li><a href="#" className="hover:text-white">Vidange fosse septique</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Zones</h4>
            {isLandingPageMode ? (
              <ul className="space-y-2">
                {selectedCity.neighborhoods?.slice(0,5).map(n => (
                   <li key={n}><span className="text-slate-500">{n}</span></li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Liège</a></li>
                <li><a href="#" className="hover:text-white">Namur</a></li>
                <li><a href="#" className="hover:text-white">Charleroi</a></li>
                <li><a href="#" className="hover:text-white">Mons</a></li>
              </ul>
            )}
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Mentions</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Mentions Légales</a></li>
              <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-white">CGV</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center">
          &copy; {new Date().getFullYear()} Hydro Débouchage {selectedCity.name}. Tous droits réservés.
        </div>
      </footer>

      {/* Floating Elements */}
      <StickyCallBtn />
      <AIChatAssistant currentCity={selectedCity.name} agentName={selectedCity.agentName} key={selectedCity.name} />
      
    </div>
  );
};

export default App; 