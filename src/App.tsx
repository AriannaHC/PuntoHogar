import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook,
  Filter,
  ChevronRight,
  ArrowRight,
  Building2,
  Key,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, FilterOptions } from './types';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);



// --- Components ---

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={`${className} bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
      PH
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-brand-primary' : 'text-white'}`}>
            Punto Hogar
          </span>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center gap-8 font-medium ${isScrolled ? 'text-slate-700' : 'text-white'}`}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-secondary transition-colors cursor-pointer">Inicio</button>
          <button onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-secondary transition-colors cursor-pointer">Propiedades</button>
          <button onClick={() => document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-brand-secondary transition-colors cursor-pointer">Nosotros</button>
          <button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="bg-brand-secondary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all cursor-pointer">Contacto</button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? 'text-brand-primary' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl p-6 flex flex-col gap-4 md:hidden"
          >
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="text-left text-slate-800 font-medium">Inicio</button>
            <button onClick={() => { document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="text-left text-slate-800 font-medium">Propiedades</button>
            <button onClick={() => { document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="text-left text-slate-800 font-medium">Nosotros</button>
            <button onClick={() => { document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="bg-brand-primary text-white px-6 py-3 rounded-xl text-center">Contacto</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl overflow-hidden property-card-shadow group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image_url} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${property.type === 'venta' ? 'bg-brand-primary text-white' : 'bg-brand-secondary text-white'}`}>
            {property.type}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-bold uppercase tracking-wider">
            {property.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{property.title}</h3>
          <span className="text-2xl font-bold text-brand-secondary">
            {property.type === 'venta' ? `$${property.price.toLocaleString()}` : `$${property.price}/mes`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 mb-4">
          <MapPin size={16} />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-slate-600">
              <Bed size={18} />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Bath size={18} />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Maximize size={18} />
              <span className="text-sm font-medium">{property.area}m²</span>
            </div>
          </div>
          <button className="text-brand-primary hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Logo className="w-8 h-8" />
            <span className="text-2xl font-bold">Punto Hogar</span>
          </div>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Expertos en conectar personas con sus hogares ideales. Calidad, confianza y transparencia en cada transacción.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-secondary transition-colors"><Instagram size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-secondary transition-colors"><Facebook size={20} /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-secondary transition-colors"><Mail size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">Navegación</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="#propiedades" className="hover:text-white transition-colors">Propiedades</a></li>
            <li><a href="#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
            <li><a href="#blog" className="hover:text-white transition-colors">Blog Inmobiliario</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Servicios</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Venta de Propiedades</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Alquiler Residencial</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gestión de Inmuebles</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Asesoría Legal</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contacto</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li className="flex items-center gap-3"><Phone size={18} className="text-brand-secondary" /> +51 900 123 456</li>
            <li className="flex items-center gap-3"><Mail size={18} className="text-brand-secondary" /> info@puntohogar.pe</li>
            <li className="flex items-center gap-3"><MapPin size={18} className="text-brand-secondary" /> Av. Larco 123, Miraflores, Lima</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2024 Punto Hogar. Todos los derechos reservados.
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = async (currentFilters: FilterOptions = {}) => {
    setLoading(true);

    try {
      let query = supabase.from("properties").select("*");

      if (currentFilters.type)
        query = query.eq("type", currentFilters.type);

      if (currentFilters.category)
        query = query.eq("category", currentFilters.category);

      if (currentFilters.search)
        query = query.ilike("title", `%${currentFilters.search}%`);

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setProperties(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = <K extends keyof FilterOptions>(
  key: K,
  value: FilterOptions[K] | "all"
) => {
  const updatedFilters = {
    ...filters,
    [key]: value === "all" ? undefined : value,
  };

  setFilters(updatedFilters);
  fetchProperties(updatedFilters);

  // Scroll to results
  const resultsSection = document.getElementById("propiedades");
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }
};
const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const newFilters = {
    ...filters,
    search: searchTerm,
  };

  setFilters(newFilters);
  fetchProperties(newFilters);
};

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/imagen3.png"
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
          >
            Encuentra el lugar donde <br /> <span className="text-brand-secondary italic">comienza tu historia</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto"
          >
            Descubre las mejores propiedades en venta y alquiler con el respaldo de expertos inmobiliarios.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass p-4 rounded-3xl max-w-5xl mx-auto shadow-2xl"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-[2] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Distrito, zona o palabra clave..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-800 focus:ring-2 focus:ring-brand-primary outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-[1.2] relative">
                <select 
                  className="w-full appearance-none bg-slate-50 pl-6 pr-12 py-4 rounded-2xl text-slate-800 font-medium outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer truncate"
                  value={filters.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="all">Tipo de Operación</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
              <button type="submit" className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                Buscar <ArrowRight size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-brand-primary mb-2">1500+</div>
            <div className="text-slate-500 font-medium">Propiedades Listadas</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-primary mb-2">800+</div>
            <div className="text-slate-500 font-medium">Clientes Felices</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-primary mb-2">15+</div>
            <div className="text-slate-500 font-medium">Años de Experiencia</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-primary mb-2">24/7</div>
            <div className="text-slate-500 font-medium">Soporte Personalizado</div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="propiedades" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-brand-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Nuestras Ofertas</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Propiedades Destacadas</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleFilterChange('category', 'all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${!filters.category ? 'bg-brand-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                Todas
              </button>
              <button 
                onClick={() => handleFilterChange('category', 'casa')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filters.category === 'casa' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                Casas
              </button>
              <button 
                onClick={() => handleFilterChange('category', 'apartamento')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filters.category === 'apartamento' ? 'bg-brand-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                Apartamentos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl text-slate-500">No se encontraron propiedades con estos filtros.</p>
                  <button 
                    onClick={() => { setFilters({}); setSearchTerm(''); fetchProperties({}); }}
                    className="mt-4 text-brand-primary font-bold underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="nosotros" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="/img/nosotros.png" 
                alt="Nuestro Equipo" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-brand-secondary p-8 rounded-3xl text-white hidden md:block">
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-sm font-medium uppercase tracking-wider">Compromiso con el cliente</div>
              </div>
            </div>
            <div>
              <span className="text-brand-secondary font-bold uppercase tracking-widest text-sm mb-4 block">¿Por qué elegirnos?</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8">Tu éxito inmobiliario es nuestra prioridad</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                En Punto Hogar, no solo vendemos propiedades; construimos relaciones duraderas. Nuestro equipo de expertos te acompañará en cada paso del camino para asegurar que encuentres exactamente lo que buscas.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-primary flex-shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Amplio Portafolio</h4>
                    <p className="text-slate-500">Acceso a las mejores propiedades exclusivas del mercado.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-primary flex-shrink-0">
                    <Key size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Gestión Integral</h4>
                    <p className="text-slate-500">Nos encargamos de todo el papeleo y trámites legales.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-primary flex-shrink-0">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Mejor Precio</h4>
                    <p className="text-slate-500">Negociamos las mejores condiciones para tu inversión.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-24 bg-brand-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">¿Listo para encontrar tu próximo hogar?</h2>
          <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto">
            Contáctanos hoy mismo y recibe asesoría personalizada sin compromiso.
          </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="https://wa.me/51900123456?text=Hola,%20estoy%20interesado%20en%20una%20propiedad" 
              target="_blank" 
              rel="noreferrer"
              className="bg-brand-secondary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl text-center"
            >
              Hablar con un Agente
            </a>
            <button 
              onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-brand-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl"
            >
              Ver Propiedades
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
