/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import welcomeImg from '../assets/images/group-brainstorming.png';
import SetupWorkspace from '../Components/Introduction-pages/setup_workspace';
import InviteMembers from '../Components/Introduction-pages/invite_members';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Toast: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed right-4 top-4 z-50 mt-4 flex w-full max-w-xs items-center rounded-lg border border-gray-700 bg-gray-800/90 p-4 text-gray-200 shadow-lg"
      role="alert"
    >
      <div className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${type === 'success' ? 'bg-blue-600 text-blue-200' : 'bg-red-600 text-red-200'}`}>
        {type === 'success' ? (
          <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
        ) : (
          <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button 
        type="button" 
        className="-m-1.5 ml-auto inline-flex size-8 rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 focus:ring-2 focus:ring-gray-600" 
        onClick={onClose} 
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="size-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </motion.div>
  );
};

const SetupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'workspace' | 'invite'>('welcome');
  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('workspace');
    } else if (currentStep === 'workspace') {
      setCurrentStep('invite');
    } else if (currentStep === 'invite') {
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'invite') {
      setCurrentStep('workspace');
    } else if (currentStep === 'workspace') {
      setCurrentStep('welcome');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleWorkspaceCreated = (id: number) => {
    setWorkspaceId(id);
    setIsLoading(false);
    setAlert({
      show: true,
      type: 'success',
      message: 'Workspace created successfully!'
    });
    setShowConfetti(true);
    setTimeout(() => {
      setAlert({ ...alert, show: false });
      setShowConfetti(false);
      setCurrentStep('invite');
    }, 3500);
  };

  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
    setShowConfetti(false);
  };

  const renderWelcomeScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-start space-y-6 px-8 py-12"
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-extrabold tracking-tight text-white"
      >
        Build Your Workspace
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-md text-lg text-gray-300"
      >
        Create a space where your team can collaborate, manage projects, and achieve greatness together.
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleNext}
          color="blue"
          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-purple-700"
        >
          Let’s Get Started
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderProgressIndicator = () => {
    if (currentStep === 'welcome') return null;

    const steps = ['workspace', 'invite'];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <div className="flex items-center justify-center space-x-4 p-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                index <= currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            >
              {index + 1}
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                className={`h-1 w-16 ${index < currentIndex ? 'bg-blue-500' : 'bg-gray-600'}`}
                initial={{ width: 0 }}
                animate={{ width: '4rem' }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'workspace':
        return <SetupWorkspace 
                 onNext={handleNext} 
                 onWorkspaceCreated={handleWorkspaceCreated} 
                 setLoading={setLoadingState} 
               />;
      case 'invite':
        return <InviteMembers workspaceId={workspaceId} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 50,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: 3,
              random: true,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}

      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
            'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Page-Centered Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="relative size-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <svg className="size-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                  className="drop-shadow-lg"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="url(#innerGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="188.4"
                  strokeDashoffset="50"
                  className="drop-shadow-md"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                  <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 font-medium text-white drop-shadow-md"
            >
              Creating your workspace...
            </motion.p>
          </div>
        </motion.div>
      )}

      {alert.show && (
        <Toast 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert} 
        />
      )}
      
      <div className="relative flex w-full max-w-6xl flex-col rounded-2xl border border-gray-700/50 bg-gray-800/50 shadow-2xl backdrop-blur-lg md:flex-row">
        {/* Left Side - Content */}
        <div className="flex flex-col md:w-1/2">
          {renderProgressIndicator()}
          <div className="relative grow p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Buttons */}
          {currentStep !== 'welcome' && (
            <div className="flex justify-between p-6">
              <Button
                onClick={handlePrevious}
                color="gray"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handleSkip}
                color="gray"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Skip
              </Button>
            </div>
          )}
        </div>

        {/* Right Side - Image */}
        <div className="hidden items-center justify-center bg-gray-900/50 p-8 md:flex md:w-1/2">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 opacity-30 blur-3xl"></div>
            <motion.img 
              src={welcomeImg} 
              alt="Workspace Illustration" 
              className="relative z-10 w-full max-w-md rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://via.placeholder.com/400x300?text=Workspace";
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;