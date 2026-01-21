import { City, Service, Testimonial } from './types';
import { Wrench, Droplets, ArrowDownToLine, Bath, ShieldCheck, Clock } from 'lucide-react';

export const CITIES: City[] = [
  { 
    name: 'Liège', 
    zip: '4000', 
    region: 'Liège',
    neighborhoods: ['Guillemins', 'Outremeuse', 'Saint-Léonard', 'Angleur', 'Grivegnée', 'Rocourt', 'Bressoux', 'Sclessin'],
    agentName: 'Max'
  },
  { 
    name: 'Namur', 
    zip: '5000', 
    region: 'Namur',
    neighborhoods: ['Jambes', 'Salzinnes', 'Saint-Servais', 'Bouge', 'Erpent', 'Wépion', 'Belgrade'],
    agentName: 'Laurent'
  },
  { 
    name: 'Charleroi', 
    zip: '6000', 
    region: 'Hainaut',
    neighborhoods: ['Gosselies', 'Marchienne', 'Jumet', 'Gilly', 'Montignies', 'Marcinelle', 'Couillet'],
    agentName: 'Karim'
  },
  { 
    name: 'Mons', 
    zip: '7000', 
    region: 'Hainaut',
    neighborhoods: ['Jemappes', 'Cuesmes', 'Nimy', 'Ghlin', 'Havré', 'Maisières'],
    agentName: 'Sophie'
  },
  { name: 'La Louvière', zip: '7100', region: 'Hainaut', agentName: 'Thomas' },
  { name: 'Tournai', zip: '7500', region: 'Hainaut', agentName: 'Julien' },
  { name: 'Wavre', zip: '1300', region: 'Brabant wallon', agentName: 'Nicolas' },
  { name: 'Verviers', zip: '4800', region: 'Liège', agentName: 'Luc' },
  { name: 'Arlon', zip: '6700', region: 'Luxembourg', agentName: 'Sarah' },
  { name: 'Bastogne', zip: '6600', region: 'Luxembourg', agentName: 'Pierre' },
  { name: 'Dinant', zip: '5500', region: 'Namur', agentName: 'Antoine' },
];

export const SERVICES: Service[] = [
  {
    id: 'wc',
    title: 'Débouchage WC',
    description: 'Vos toilettes sont bouchées ? Intervention rapide pour éviter tout débordement.',
    icon: 'Bath',
  },
  {
    id: 'sink',
    title: 'Évier & Lavabo',
    description: 'Écoulement lent ou bloqué dans la cuisine ou la salle de bain.',
    icon: 'Droplets',
  },
  {
    id: 'sewer',
    title: 'Égouts & Canalisations',
    description: 'Hydrocurage haute pression pour nettoyer vos canalisations en profondeur.',
    icon: 'ArrowDownToLine',
  },
  {
    id: 'inspection',
    title: 'Inspection Caméra',
    description: 'Diagnostic précis par caméra endoscopique pour localiser le bouchon.',
    icon: 'ShieldCheck',
  },
  {
    id: 'emergency',
    title: 'Urgence 24/7',
    description: 'Une équipe de garde prête à intervenir nuit, week-end et jours fériés.',
    icon: 'Clock',
  },
  {
    id: 'maintenance',
    title: 'Entretien & Curage',
    description: 'Prévention des bouchons et mauvaises odeurs.',
    icon: 'Wrench',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Jean Dubois',
    location: 'Liège',
    text: 'Intervention en moins de 45 minutes un dimanche soir. Le technicien était poli et efficace. Prix annoncé au téléphone respecté.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marie Laurent',
    location: 'Namur',
    text: 'Très satisfaite. Mon évier était complètement bloqué, ils ont utilisé la haute pression et tout est rentré dans l’ordre.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Pierre Michaux',
    location: 'Charleroi',
    text: 'Service honnête. Pas de mauvaise surprise sur la facture. Je recommande pour les urgences.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Sophie Renard',
    location: 'Mons',
    text: 'Rapide et efficace. Le technicien connaissait bien le quartier et est arrivé très vite.',
    rating: 5,
  },
];

export const COMPANY_PHONE = "0470 12 34 56";