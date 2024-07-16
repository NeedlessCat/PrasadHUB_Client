import React from "react";

const About = () => {
  return (
    <div className="bg-black bg-opacity-80 mt-2">
      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <img
                src="https://i.ytimg.com/vi/kzJo4hFAi2s/maxresdefault.jpg" // Replace with your actual image
                alt="About PrasahHUB"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2 md:pl-10">
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                About PrasahHUB
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                PrasahHUB is your one-stop destination for all your needs. We
                offer a wide range of services including foreign goods,
                delivery, and takeaway options. Our mission is to provide
                high-quality products and exceptional service to our valued
                customers.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in [year], we've been serving our community with
                dedication and passion. Our team of experts works tirelessly to
                ensure that you have the best shopping experience possible.
              </p>
              <a
                href="#"
                className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
