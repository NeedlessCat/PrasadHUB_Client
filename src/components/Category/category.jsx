import { useNavigate } from "react-router-dom";
import hero2 from "../../assets/hero3.jpeg";

// category
const category = [
  {
    image: "https://cdn-icons-png.flaticon.com/256/4359/4359963.png",
    name: "foreign",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/256/11833/11833323.png",
    name: "delivery",
  },
  {
    image: "https://cdn-icons-png.flaticon.com/256/8174/8174424.png",
    name: "takeaway",
  },
];

const Category = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${hero2})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 text-center text-white px-4">
        {/* main 1 */}
        {/* <div className="flex overflow-x-scroll lg:justify-center  hide-scroll-bar"> */}
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          Welcome to PrasadHUB
        </h1>
        <p className="text-xl mb-12">Please choose a category:</p>
        {/* main 2  */}
        <div className="flex justify-center flex-wrap gap-8">
          {/* category  */}
          {category.map((item, index) => (
            <div key={index} className="group">
              <div
                onClick={() => navigate(`/category/${item.name}`)}
                className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-3/5 h-3/5 filter brightness-0 invert"
                />
              </div>
              <h2 className="text-lg md:text-xl font-medium capitalize group-hover:text-pink-400 transition-colors duration-300">
                {item.name}
              </h2>
            </div>
          ))}{" "}
        </div>
        {/* </div> */}
      </div>

      {/* style  */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            ".hide-scroll-bar {  -ms-overflow-style: none;  scrollbar-width: none;}.hide-scroll-bar::-webkit-scrollbar {  display: none;}",
        }}
      />
    </div>
  );
};

export default Category;
