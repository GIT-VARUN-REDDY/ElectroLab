import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsCounter from '../components/home/StatsCounter';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturedProjects from '../components/home/FeaturedProjects';
import ServicesSection from '../components/home/ServicesSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FAQSection from '../components/home/FAQSection';
import Newsletter from '../components/home/Newsletter';

const Home = () => (
  <main aria-label="ElectroLab home page">
    <HeroSection />
    <StatsCounter />
    <CategoriesSection />
    <FeaturedProjects />
    <ServicesSection />
    <WhyChooseUs />
    <Testimonials />
    <FAQSection />
    <Newsletter />
  </main>
);

export default Home;