import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ArrowRight, ShieldCheck, Mail, Loader2, Database } from 'lucide-react';
import { loginAdmin } from '../../utils/inventoryStorage';

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAdmin(email.trim(), password.trim());
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Credenciais inválidas. Verifique seu login e senha.');
      }
    } catch (err) {
      setError('Erro ao autenticar com o banco de dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#1b1b1b] rounded-sm w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#1b1b1b] flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-xs bg-[#d50104] text-white">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
              Área Restrita • GTR MOTORS
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A7A7A7] hover:text-white p-1 rounded-sm hover:bg-[#1b1b1b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <h4 className="font-display font-black text-lg text-white uppercase tracking-tight">
              Acesso Administrativo
            </h4>
            <p className="text-xs text-[#A7A7A7]">
              Informe seu e-mail e senha para gerenciar o estoque.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-sm text-red-200 text-xs animate-in fade-in">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-[#A7A7A7]">
              E-mail do Administrador
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                required
                placeholder="Digite seu e-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d50104]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase text-[#A7A7A7]">
                Senha de Acesso
              </label>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080808] border border-[#1b1b1b] rounded-sm pl-9 pr-10 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d50104]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#d50104] hover:bg-[#b00103] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#A7A7A7] border-t border-[#1b1b1b]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d50104]" />
            <span>Autenticação Criptografada e Segura</span>
          </div>
        </form>

      </div>
    </div>
  );
};
