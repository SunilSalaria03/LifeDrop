import { ActionCards } from '@/components/landing/ActionCards';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-white text-neutral-950">
        <HeroSection />
        <ActionCards />
      </main>
      <Footer />
    </>
  );
}
