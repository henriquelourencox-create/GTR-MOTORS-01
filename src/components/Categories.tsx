import React from 'react';
import { Car, Bike, ArrowRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (cat: 'carro' | 'moto') => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  return (
    <section id="categorias" className="py-12 bg-[#080808] border-y border-[#1b1b1b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600]">
            Categorias Principais
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            ESCOLHA O SEU ESTILO DE PILOTAGEM
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CARROS Card */}
          <div
            onClick={() => onSelectCategory('carro')}
            className="group relative h-80 sm:h-96 rounded-sm overflow-hidden border border-[#1b1b1b] hover:border-[#E10600]/60 cursor-pointer shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
              alt="Carros na GTR MOTORS"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.4] group-hover:brightness-[0.5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-sm bg-black/80 border border-[#1b1b1b] backdrop-blur-md flex items-center justify-center text-[#E10600]">
                <Car className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600] mb-1 block">
                  Estoque de Carros
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                  CARROS
                </h3>
                <p className="text-[#A7A7A7] text-xs sm:text-sm font-medium mb-5 max-w-md">
                  Encontre seu próximo carro na GTR MOTORS. SUVs, Sedans e Hatches selecionados com procedência rigorosa.
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-[#E10600] group-hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-md transition-all"
                >
                  <span>VER CARROS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* MOTOS Card */}
          <div
            onClick={() => onSelectCategory('moto')}
            className="group relative h-80 sm:h-96 rounded-sm overflow-hidden border border-[#1b1b1b] hover:border-[#E10600]/60 cursor-pointer shadow-xl transition-all duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop"
              alt="Motos na GTR MOTORS"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.4] group-hover:brightness-[0.5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-sm bg-black/80 border border-[#1b1b1b] backdrop-blur-md flex items-center justify-center text-[#E10600]">
                <Bike className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E10600] mb-1 block">
                  Estoque de Motos
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                  MOTOS
                </h3>
                <p className="text-[#A7A7A7] text-xs sm:text-sm font-medium mb-5 max-w-md">
                  Escolha sua próxima moto com quem entende de veículos. Big Trail, Naked, Custom e Esportivas.
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-[#E10600] group-hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-md transition-all"
                >
                  <span>VER MOTOS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
