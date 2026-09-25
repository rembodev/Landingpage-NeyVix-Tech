import React, { useState, useEffect } from 'react';
import { X, User, Phone, Lock, CheckCircle2, AlertCircle, Save, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Por favor ingrese su nombre y apellidos.');
      return;
    }

    // Validación de contraseña si se intentó cambiar
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden. Verifíquelas.');
        return;
      }
    }

    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName,
        phone: phone,
        password: newPassword.trim() ? newPassword.trim() : undefined,
      });

      setSuccessMessage('¡Perfil actualizado con éxito!');
      setNewPassword('');
      setConfirmPassword('');

      // Auto-cerrar después de 1.5s para que el técnico vea la confirmación
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMessage(err.message || 'Ocurrió un error al actualizar los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121926] border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F17]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mi Perfil Técnico</h3>
              <p className="text-[11px] text-slate-400">Gestiona tus datos personales y contraseña</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Alertas de Feedback */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tarjeta de Resumen con Avatar */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-cyan-500/50 shrink-0">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.full_name ? `Avatar de perfil de ${user.full_name}` : 'Avatar de perfil de técnico responsable'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {user?.full_name || 'Técnico'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {user?.role === 'admin' ? 'Administrador' : 'Técnico de Laboratorio'}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Nombre Completo */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Nombre y Apellidos *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Carlos Mendoza"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* 2. Correo Electrónico (Solo lectura) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Correo Electrónico (Identificador de acceso)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* 3. Número de WhatsApp / Teléfono */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Número de Teléfono / WhatsApp (Contacto Interno)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 929443131"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* 4. Sección de Cambio de Contraseña */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Cambiar Contraseña de Acceso</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mín. 6 caracteres"
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita la clave"
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              * Deja ambos campos vacíos si no deseas cambiar tu contraseña actual.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition shadow-md shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
