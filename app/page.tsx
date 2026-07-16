import Hero from "@/components/home/hero";
import Features from "@/components/home/Features";
import ProductCards from "@/components/home/ProductCards";
import Banner from "@/components/home/Banner";
import SaleSection from "@/components/home/SalesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ProductCards />
      <Banner />
      <SaleSection /> 
    </>
  );
}