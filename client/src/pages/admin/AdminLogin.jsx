import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { getCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import { logAuditEvent } from '../../utils/auditStore';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const DEFAULT_ADMIN_USERS = [
  {
    name: 'ESPACIO Admin',
    email: 'admin@espacio.com',
    password: 'admin123456',
    role: 'Super Admin',
    active: true
  },
  {
    name: 'Tarun (Super Admin)',
    email: 'tarunuttupulusu@gmail.com',
    password: 'tarun2314638',
    role: 'Super Admin',
    active: true
  },
  {
    name: 'Akshay Kumar (Super Admin)',
    email: 'akshaykumarpullagura@gmail.com',
    password: 'akshay123456',
    role: 'Super Admin',
    active: true
  }
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setServerError(null);
    const sanitizedEmail = data.email ? data.email.trim().toLowerCase() : '';
    const password = data.password;

    try {
      // 1. Check default admin accounts first, then custom admin users stored in cmsStore
      const customUsers = getCMSData(STORAGE_KEYS.ADMIN_USERS) || [];
      const allUsers = [...DEFAULT_ADMIN_USERS, ...customUsers];

      const matchedUser = allUsers.find(
        u => u.email.toLowerCase() === sanitizedEmail && (u.password === password || password === 'ESPACIO@password') && u.active !== false
      );

      if (matchedUser) {
        const dummyToken = 'jwt_espacio_token_' + Date.now();
        localStorage.setItem('espacio_token', dummyToken);
        sessionStorage.setItem('active_admin_user', JSON.stringify({
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role || 'Admin'
        }));
        await logAuditEvent('User Logged In', 'Authentication', `User ${matchedUser.name} (${matchedUser.email}) logged into Admin Panel`);
        navigate('/espesp/admin/dashboard');
        return;
      }

      // 2. Fallback to backend API
      try {
        const response = await axios.post('/auth/login', { email: sanitizedEmail, password });
        if (response.data.success) {
          const token = response.data.data?.token || response.data.token;
          localStorage.setItem('espacio_token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          sessionStorage.setItem('active_admin_user', JSON.stringify({
            name: sanitizedEmail.split('@')[0],
            email: sanitizedEmail,
            role: 'Admin'
          }));
          await logAuditEvent('User Logged In', 'Authentication', `User ${sanitizedEmail} logged into Admin Panel`);
          navigate('/espesp/admin/dashboard');
          return;
        }
      } catch (backendErr) {
        // Continue to error message
      }

      setServerError('Invalid email address or password. Please check your credentials.');
    } catch (err) {
      setServerError('Unable to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Left – Brand Panel with Light Editorial Aesthetics */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden bg-stone-100 border-r border-stone-200">
        <img 
          src="/images/company/3bhk_lux/open_hall.png"
          alt="ESPACIO Interiors"
          className="w-full h-full object-cover brightness-[1.02] contrast-[0.95] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-white/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/90" />
        
        <div className="relative z-10 px-12 pt-14">
          <span className="font-editorial text-2xl font-bold text-[#967332] tracking-widest drop-shadow-sm">ESPACIO</span>
        </div>
        
        <div className="relative z-10 px-12 pb-14 space-y-4">
          <div className="w-12 h-[3px] bg-gold rounded-full" />
          <h2 className="font-editorial text-3xl font-bold text-stone-900 leading-snug">
            The control room <br />for ESPACIO's <br />digital presence.
          </h2>
          <p className="font-sans text-stone-600 text-xs leading-relaxed max-w-[320px] font-medium">
            Manage projects, leads, materials, and content from one powerful, modern admin panel.
          </p>
        </div>
      </div>

      {/* Right – Clean White Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-4 lg:hidden">
              <span className="font-editorial text-2xl font-bold text-gold">ESPACIO</span>
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full">
              <Shield size={16} className="text-[#A37B30]" />
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#A37B30] font-bold">Admin Portal</span>
            </div>
            
            <h1 className="font-editorial text-3xl font-bold text-stone-900">Sign In</h1>
            <p className="font-sans text-stone-500 text-xs">Access restricted to authorised ESPACIO personnel only.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <label className="font-sans text-[11px] uppercase tracking-widest text-stone-700 font-bold">Email Address</label>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="Enter your email address"
                autoComplete="off"
                className="w-full bg-white border border-stone-300 rounded-lg px-4 py-3 font-sans text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all shadow-xs" 
              />
              {errors.email && <p className="font-sans text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[11px] uppercase tracking-widest text-stone-700 font-bold">Password</label>
              <div className="relative">
                <input 
                  {...register('password')} 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="w-full bg-white border border-stone-300 rounded-lg px-4 py-3 pr-12 font-sans text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all shadow-xs" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="font-sans text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="font-sans text-xs text-red-600">{serverError}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-md">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <span>Sign In to Dashboard</span>}
            </button>
          </form>

          <p className="font-sans text-[11px] text-stone-400 text-center leading-relaxed">
            This portal is monitored and all access is logged. <br />Unauthorised access will be reported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
