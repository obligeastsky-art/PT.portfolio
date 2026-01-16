
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0723') {
      onLoginSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-navy text-white rounded-[2rem] shadow-xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-navy mb-2">관리자 로그인</h2>
          <p className="text-gray-500">포트폴리오 수정을 위해 비밀번호를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Password</label>
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              className={`w-full px-5 py-4 bg-gray-50 border ${error ? 'border-red-500 bg-red-50' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-navy outline-none transition-all text-center text-2xl tracking-[0.5em] font-bold`}
              placeholder="••••"
            />
            {error && <p className="text-red-500 text-sm mt-3 text-center font-medium">비밀번호가 일치하지 않습니다.</p>}
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full py-4 bg-navy text-white font-bold rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-navy/20"
            >
              로그인
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-3 text-gray-400 font-medium hover:text-navy transition-colors"
            >
              돌아가기
            </button>
          </div>
        </form>
        
        <p className="mt-8 text-center text-xs text-gray-400">
          비밀번호 분실 시 시스템 관리자에게 문의하세요.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
