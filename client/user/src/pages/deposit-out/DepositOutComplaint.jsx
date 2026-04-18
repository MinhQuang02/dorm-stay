import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import MainLayout from '../../components/Layout/MainLayout';

export default function DepositOutComplaint() {
  const navigate = useNavigate();
  
  // React hook form and Complaint State
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange'
  });
  
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState({ open: false, type: '', message: '', onConfirm: null });
  
  const showToast = (type, message, onConfirm = null) => {
    setToast({ open: true, type, message, onConfirm });
    if (type !== 'confirm' && type !== 'success') {
      setTimeout(() => {
        setToast(prev => prev.open && prev.message === message ? { ...prev, open: false } : prev);
      }, 4000);
    }
  };
  
  const hideToast = () => setToast(prev => ({ ...prev, open: false }));

  // Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(''); // 'success', 'error', 'loading'
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Complaint Submit Logic
  const onSubmit = async (data) => {
    if (!confirmChecked) {
      showToast('warning', "Please confirm you wish to file a complaint.");
      return;
    }
    
    showToast('confirm', "Are you sure you want to submit this complaint?", () => handleVerifiedSubmit(data));
  };

  const handleVerifiedSubmit = async (data) => {
    hideToast();

    try {
      const formData = new FormData();
      formData.append('contractCode', data.contractCode);
      formData.append('roomId', data.roomId);
      formData.append('bedId', data.bedId);
      if (data.contactName) formData.append('contactName', data.contactName);
      if (data.contactPhone) formData.append('contactPhone', data.contactPhone);
      formData.append('email', data.email);
      if (data.message) formData.append('message', data.message);
      if (evidenceFile) formData.append('evidence', evidenceFile);

      const response = await fetch('http://localhost:5000/api/interaction/complaint', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showToast('success', result.message || 'Validation passed perfectly!');
      } else {
        showToast('error', result.error || 'Validation failed.');
      }
      
    } catch (error) {
      showToast('error', "Failed to connect to the server.");
    }
  };

  // Newsletter Submit Logic
  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail) {
      setNewsletterStatus('error');
      setNewsletterMessage('Email cannot be empty.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Invalid email format.');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('Verifying email domain...');
    
    try {
      const response = await fetch('http://localhost:5000/api/interaction/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const result = await response.json();
      
      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage('Domain valid! Ready to subscribe.');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(result.error || 'Failed to verify email domain.');
      }
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterMessage('Failed to connect to server.');
    }
  };

  // Toast Component Inside
  const ToastNotification = () => {
    if (!toast.open) return null;
    
    const isConfirm = toast.type === 'confirm';
    const isSuccess = toast.type === 'success';
    const isError = toast.type === 'error';
    const isWarning = toast.type === 'warning';

    let borderColor = 'border-gray-200';
    let iconColor = 'text-gray-500';
    let title = 'Notification';

    if (isConfirm) {
      borderColor = 'border-[#ce713b]';
      iconColor = 'text-[#ce713b]';
      title = 'Confirm Action';
    } else if (isSuccess) {
      borderColor = 'border-green-500';
      iconColor = 'text-green-600';
      title = 'Success';
    } else if (isError) {
      borderColor = 'border-red-500';
      iconColor = 'text-red-500';
      title = 'Error';
    } else if (isWarning) {
      borderColor = 'border-yellow-500';
      iconColor = 'text-yellow-600';
      title = 'Notice';
    }

    return (
      <div className={`fixed bottom-6 right-6 z-50 w-80 bg-white border-l-4 ${borderColor} shadow-2xl rounded overflow-hidden transform transition-all`}>
        <div className="p-5">
          <div className="flex items-start">
            <div className="flex-1 pt-0.5">
              <p className={`text-sm font-bold ${iconColor}`}>{title}</p>
              <p className="mt-1.5 text-sm text-gray-700">{toast.message}</p>
              
              <div className="mt-4 flex gap-2">
                {isConfirm && (
                  <>
                    <button onClick={toast.onConfirm} className="text-xs font-semibold text-white bg-[#ce713b] px-4 py-1.5 rounded hover:bg-[#b55e2d] transition-colors focus:outline-none">
                      Submit
                    </button>
                    <button onClick={hideToast} className="text-xs font-semibold text-gray-700 bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200 transition-colors focus:outline-none">
                      Cancel
                    </button>
                  </>
                )}
                {isSuccess && (
                  <>
                    <button onClick={() => navigate('/deposit-out')} className="text-xs font-semibold text-white bg-green-600 px-4 py-1.5 rounded hover:bg-green-700 transition-colors focus:outline-none">
                      Return
                    </button>
                    <button onClick={hideToast} className="text-xs font-semibold text-gray-700 bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200 transition-colors focus:outline-none">
                      Close
                    </button>
                  </>
                )}
                {(isError || isWarning) && (
                  <button onClick={hideToast} className="text-xs font-semibold text-white bg-gray-800 px-4 py-1.5 rounded hover:bg-gray-900 transition-colors focus:outline-none">
                    Close
                  </button>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button onClick={hideToast} className="inline-flex text-gray-400 hover:text-gray-500 transition-colors focus:outline-none">
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout title="Deposit Payment" mainClassName="flex-1 px-6 md:px-16 py-12 flex justify-center relative">
      <ToastNotification />
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-32">
        {/* Left - Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Complaint Request</h2>
          <p className="text-[13px] text-gray-500 mb-10 w-[90%] leading-relaxed">
            Please fill out my complaint form completely so we can understand the issue and try to resolve it.
          </p>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input 
                type="text" 
                placeholder="Contract Code" 
                {...register('contractCode', { required: 'Contract Code is required' })}
                className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" 
              />
              {errors.contractCode && <p className="text-[11px] text-red-500 mt-1">{errors.contractCode.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <input 
                  type="text" 
                  placeholder="Room ID" 
                  {...register('roomId', { required: 'Room ID is required' })}
                  className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" 
                />
                {errors.roomId && <p className="text-[11px] text-red-500 mt-1">{errors.roomId.message}</p>}
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Bed ID" 
                  {...register('bedId', { required: 'Bed ID is required' })}
                  className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" 
                />
                {errors.bedId && <p className="text-[11px] text-red-500 mt-1">{errors.bedId.message}</p>}
              </div>
            </div>
            <div>
              <input type="text" placeholder="Contact name" {...register('contactName')} className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
            </div>
            <div>
              <input type="text" placeholder="Contact Phone" {...register('contactPhone')} className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="email@gmail.com" 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please, enter valid email address'
                  }
                })}
                className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" 
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1.5">{errors.email.message}</p>}
            </div>
            <div>
              <input type="text" placeholder="Let's talk about your problems" {...register('message')} className="w-full border-0 border-b border-gray-400 bg-transparent pb-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors mt-2" />
            </div>

            {/* Upload */}
            <div className="mt-8">
              <label htmlFor="evidence-upload" className="border border-dashed border-gray-400 rounded-sm py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-[13px] text-gray-400">
                    {evidenceFile ? evidenceFile.name : "Upload Evidence file"}
                  </span>
                </div>
                <input 
                  id="evidence-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setEvidenceFile(e.target.files[0]);
                    }
                  }} 
                />
              </label>
              <p className="text-[10px] text-gray-400 mt-2">Attach file. File size of your documents should not exceed 10MB</p>
            </div>

            <button type="submit" className="w-full bg-[#ce713b] text-white font-bold text-xs tracking-wider py-3.5 mt-2 rounded hover:bg-[#b55e2d] transition-colors block text-center">
              SUBMIT
            </button>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input 
                type="checkbox" 
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="w-3 h-3 text-[#cc6b34] border-gray-400 rounded focus:ring-[#cc6b34] bg-transparent" 
              />
              <span className="text-[11px] text-gray-700">I confirm that I wish to file a complaint with the management.</span>
            </label>
          </form>
        </div>

        {/* Right - Contact Info */}
        <div className="flex flex-col gap-12 mt-4 lg:mt-16">
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-6">Offices</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[12px] text-gray-600">Ho Chi Minh City</p>
                <p className="text-[12px] text-gray-600 mt-0.5">500 5th Avenue Suite 400, NY 10110</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-600">Ha Noi City</p>
                <p className="text-[12px] text-gray-600 mt-0.5">High St, Bromley BR1 1DN</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-6">For Quick Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.864-1.051l-3.21-.535a2.25 2.25 0 0 0-2.26.621l-1.026 1.026c-2.839-1.503-5.09-3.754-6.593-6.593l1.026-1.026a2.25 2.25 0 0 0 .621-2.26l-.535-3.21C7.716 2.601 7.266 2.25 6.75 2.25H5.372c-1.22 0-2.203.956-2.246 2.174A14.966 14.966 0 0 0 2.25 6.75Z" />
                </svg>
                <p className="text-[12px] text-gray-600">+84 912 991 873</p>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <p className="text-[12px] text-gray-600">mphanquang06@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-6">Would you like to join our newsletter?</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-end">
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 border-0 border-b border-gray-400 bg-transparent pb-2 text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:border-[#cc6b34] transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={handleNewsletterSubmit}
                  disabled={newsletterStatus === 'loading'}
                  className="bg-[#ce713b] w-10 h-10 flex items-center justify-center hover:bg-[#b55e2d] transition-colors ml-4 shadow-sm disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </div>
              {newsletterMessage && (
                <p className={`text-[11px] mt-1 ${newsletterStatus === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {newsletterMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
