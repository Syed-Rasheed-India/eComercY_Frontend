import H_main from "./H_main";
import FeaturedProducts from "./FeaturedProducts";
// import products from "../data/product";
import SaleBanner from "./SaleBanner";
function Home() {
  return (
    <>
      <H_main />
      <FeaturedProducts />
      <SaleBanner />
    </>
  );
}

export default Home;