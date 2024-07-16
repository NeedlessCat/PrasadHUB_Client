import Layout from "../../components/Layout/layout";
import React from "react";
import About from "../../components/About/about";
import Testimonial from "../../components/Testimonial/testimonial";
import Track from "../../components/Track/track";
import hero2 from "../../assets/hero3.jpeg";
import Footer from "../../components/Footer/footer";

const AboutPage = () => {
  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${hero2})`,
        }}
      ></div>

      <div className="relative z-10">
        <div className="bg-black bg-opacity-80 text-white">
          <Layout>
            <div className="py-20 mx-4">
              <About />
            </div>
            <Testimonial />
          </Layout>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
