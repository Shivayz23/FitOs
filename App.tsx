import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Navbar } from './components/Navbar';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { MealScreen } from './screens/MealScreen';
import { StatsScreen } from './screens/StatsScreen';
import { loadUser, loadTodayStats } from './services/storageService';
import { ScreenName, UserProfile, DailyStats } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const initApp = () => {
    const loadedUser = loadUser();
    const loadedStats = loadTodayStats();
    
    setUser(loadedUser);
    setStats(loadedStats);
    
    if (!loadedUser) {
      setCurrentScreen('onboarding');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initApp();
  }, []);

  const handleRefresh = () => {
    setUser(loadUser());
    setStats(loadTodayStats());
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading OS...</div>;
  }

  // Onboarding Flow
  if (currentScreen === 'onboarding') {
    return (
      <Layout>
        <OnboardingScreen onComplete={() => {
          initApp();
          setCurrentScreen('home');
        }} />
      </Layout>
    );
  }

  // Main App Flow
  return (
    <Layout>
      <div className="flex-1 overflow-hidden relative">
        {currentScreen === 'home' && user && stats && (
          <HomeScreen 
            user={user} 
            stats={stats} 
            onNavigate={setCurrentScreen} 
            refreshStats={handleRefresh}
          />
        )}
        
        {currentScreen === 'workouts' && user && (
          <WorkoutScreen 
            user={user} 
            refreshUser={handleRefresh}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        
        {currentScreen === 'meals' && (
          <MealScreen />
        )}
        
        {currentScreen === 'stats' && stats && (
          <StatsScreen stats={stats} refreshStats={handleRefresh} />
        )}
      </div>
      
      <Navbar current={currentScreen} onNavigate={(screen) => {
          setCurrentScreen(screen);
      }} />
    </Layout>
  );
}

export default App;