import React from 'react';
import { Instagram, Youtube, Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import { COMPANY } from '../data/company';
import { INSTAGRAM_DEMO_POSTS } from '../data/vehicles';

export const InstagramFeed: React.FC = () => {
  return (
    <section id="instagram" className="py-12 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#E10600] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <Instagram className="w-3.5 h-3.5" />
              <span>Redes Sociais</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              ACOMPANHE A GTR MOTORS
            </h2>
            <p className="text-[#A7A7A7] text-xs sm:text-sm mt-1">
              Veja novidades, veículos disponíveis e vídeos no nosso Instagram{' '}
              <span className="text-[#E10600] font-bold">{COMPANY.instagram.handle}</span> e canal do YouTube{' '}
              <span className="text-[#E10600] font-bold">{COMPANY.youtube.handle}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <a
              id="btn-seguir-instagram"
              href={COMPANY.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#E10600] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm shadow-md transition-all active:scale-[0.98]"
              aria-label="Seguir no Instagram @gtrmotorssp"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>INSTAGRAM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              id="btn-canal-youtube"
              href={COMPANY.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-[#2a2a2a] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm shadow-md transition-all active:scale-[0.98]"
              aria-label="Inscrever-se no canal do YouTube @gtrmotors-sp"
            >
              <Youtube className="w-3.5 h-3.5 text-[#E10600]" />
              <span>YOUTUBE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Instagram Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INSTAGRAM_DEMO_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-sm overflow-hidden bg-[#111111] border border-[#1b1b1b] hover:border-[#2a2a2a] shadow-lg transition-all block"
            >
              <img
                src={post.imageUrl}
                alt="Post Instagram GTR Motors"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-between backdrop-blur-xs">
                <div className="flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                    {post.comments}
                  </span>
                </div>

                <p className="text-white text-[11px] line-clamp-3 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex items-center gap-1 text-[10px] font-bold text-[#E10600] uppercase tracking-wider">
                  <span>Ver no Instagram</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
