import logo from './logo.svg';
import React,{ useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Home from './components/home/Home';
import About from './components/about/About';
import Portfolio from './components/portfolio/Portfolio';
import Projects from './components/projects/Projects';
import Resume from './components/resume/Resume';
import Contact from './components/contact/Contact';
import Blog from './components/blog/Blog';
import Testmonials from './components/testmonials/Testmonials';
import AdminPanel from './components/admin/AdminPanel';
import Newsletter from './components/newsletter/Newsletter';
import NewsletterVerify from './components/newsletter/NewsletterVerify';
import NewsletterUnsubscribe from './components/newsletter/NewsletterUnsubscribe';
import HeaderSocials from './components/headersocials/HeaderSocials';
import BackToTop from './components/backToTop/BackToTop';
import { trackPageView } from "./analytics";
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/themeToggle/ThemeToggle';
import WelcomeLoader from './components/loader/WelcomeLoader';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  const App = () => {
    useEffect(() => {
      trackPageView();
    } ,[])
  };

  useEffect(() => {
    // Check if URL contains special routes
    const path = window.location.pathname;
    if (path === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Check for special routes
  const path = window.location.pathname;
  
  // Show newsletter verify page
  if (path === '/newsletter/verify') {
    return (
      <ThemeProvider>
        <NewsletterVerify />
      </ThemeProvider>
    );
  }

  // Show newsletter unsubscribe page
  if (path === '/newsletter/unsubscribe') {
    return (
      <ThemeProvider>
        <NewsletterUnsubscribe />
      </ThemeProvider>
    );
  }

  // Show admin panel if /admin route
  if (showAdmin) {
    return (
      <ThemeProvider>
        <AdminPanel />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <WelcomeLoader onLoadingComplete={handleLoadingComplete} />
      <ThemeToggle />
      <Sidebar/>
      <BackToTop />
      <Home />
      <About />
      <Projects />
      <Resume />
      <Portfolio />
      <Testmonials/>
      <Blog/>
      <Newsletter />
      <Contact />
      <main className="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-40 2xl:mx-52 ">
        <HeaderSocials />
      </main>
    </ThemeProvider>
  );
}

export default App;
