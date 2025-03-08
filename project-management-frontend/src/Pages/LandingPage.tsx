import FAQSection from "../Components/LandingPage/FAQSection"
import FeaturesSection from "../Components/LandingPage/FeaturesSection"
import HeaderSection from "../Components/LandingPage/HeaderSection"
import HeroSection from "../Components/LandingPage/HeroSection"
import PricingSection from "../Components/LandingPage/PricingSection"
import FooterSection from "../Components/LandingPage/FooterSection"

function LandingPage() {
  return (
    <div>
      <HeaderSection/>
      <HeroSection/>
      <FeaturesSection/>
      <PricingSection/>
      <FAQSection/>
      <FooterSection/>  

    </div>
  )
}

export default LandingPage