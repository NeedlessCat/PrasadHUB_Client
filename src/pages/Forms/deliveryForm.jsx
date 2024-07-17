import Layout from "../../components/Layout/layout";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/firebaseConfig";
import hero2 from "../../assets/hero3.jpeg";

import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const keyPayment = import.meta.env.RAZORPAY_KEY_ID;

const DeliveryForm = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  // navigate
  const navigate = useNavigate();

  // User Signup State
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    amount: "",
    father: "",
    address: "",
    district: "",
    state: "",
    country: "",
    pin: "",
    adhaar: "",
    role: "delivery",
  });

  /**========================================================================
   *                          User Signup Function
   *========================================================================**/

  const userDetailsFunction = async () => {
    // validation
    if (
      userDetails.name.trim() === "" ||
      userDetails.email.trim() === "" ||
      userDetails.mobile.trim() === "" ||
      userDetails.amount.trim() === "" ||
      userDetails.father.trim() === "" ||
      userDetails.address.trim() === "" ||
      userDetails.district.trim() === "" ||
      userDetails.state.trim() === "" ||
      userDetails.country.trim() === "" ||
      userDetails.pin.trim() === "" ||
      userDetails.adhaar.trim() === ""
    ) {
      toast.error("All Fields are required");
      return;
    }

    setLoading(true);

    // create user object
    const user = {
      name: userDetails.name,
      email: userDetails.email,
      role: userDetails.role,
      amount: userDetails.amount,
      mobile: userDetails.mobile,
      father: userDetails.father,
      address: userDetails.address,
      district: userDetails.district,
      state: userDetails.state,
      country: userDetails.country,
      pin: userDetails.pin,
      adhaar: userDetails.adhaar,
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    try {
      const response = await fetch(
        // "http://localhost:3001/create-razorpay-order",
        "https://prasadhub-server.onrender.com/create-razorpay-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseInt(userDetails.amount * 100),
            currency: "INR",
            receipt: "order_rcptid_" + user.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await response.json();
      // console.log("OrderData", orderData);

      var options = {
        key: keyPayment,
        amount: parseInt(userDetails.amount * 100),
        currency: "INR",
        order_receipt: "order_rcptid_" + user.name,
        name: "PrasadHUB",
        description: "for testing purpose",
        order_id: orderData.id,
        handler: async function (response) {
          // console.log("Payment response:", response);
          try {
            // if (
            //   !response.razorpay_payment_id ||
            //   !response.razorpay_order_id ||
            //   !response.razorpay_signature
            // ) {
            //   throw new Error("Missing required Razorpay parameters");
            // }
            const verifyResponse = await fetch(
              "https://prasadhub-server.onrender.com/verify-payment",
              // "http://localhost:3001/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  email: userDetails.email,
                }),
              }
            );
            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // console.log("Verify response status:", verifyResponse.status);
            const verifyData = await verifyResponse.json();
            // console.log("Verify response data:", verifyData);

            if (verifyData.verified) {
              toast.success("Payment Successful!");

              const orderInfo = {
                ...user,
                orderInfo: {
                  date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }),
                  email: userDetails.email,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                },
              };

              const userRefrence = collection(fireDB, "deliveryForms");
              await addDoc(userRefrence, orderInfo);

              setUserDetails({
                name: "",
                email: "",
                mobile: "",
                amount: "",
                father: "",
                address: "",
                district: "",
                state: "",
                country: "",
                pin: "",
                adhaar: "",
              });
              setLoading(false);
              navigate("/");
            } else {
              toast.error(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      var pay = new window.Razorpay(options);
      pay.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Fixed background image with overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${hero2})`, // Replace with your image path
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center py-1 pt-32 px-4 sm:px-2 lg:px-4">
        <div className="max-w-7xl w-full space-y-8 bg-gray-900 p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Donation Form
          </h1>
          {loading && <Loader />}
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section
              aria-labelledby="cart-heading"
              className="rounded-lg lg:col-span-8"
            >
              <h2 id="cart-heading" className="sr-only">
                Fill the details correctly in form
              </h2>
              <div className="bg-gray-800 px-4 py-6 sm:p-8 border border-gray-700 rounded-xl shadow-md">
                {/* Input fields */}
                <div className="space-y-4">
                  <div className="relative text-gray-400 border-b-2 rounded">
                    <p className="pl-1">Personal Details</p>
                  </div>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      value={userDetails.name}
                      onChange={(e) =>
                        setUserDetails({ ...userDetails, name: e.target.value })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="fullName"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="father"
                      type="text"
                      value={userDetails.father}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          father: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="father"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      S/o/W/o/D/o Name
                    </label>
                  </div>
                  <div className="relative text-gray-400 border-b-2 rounded">
                    Contact Details
                  </div>
                  <div className="relative">
                    <input
                      id="emailAddress"
                      type="email"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          email: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="emailAddress"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="mobile"
                      type="number"
                      value={userDetails.mobile}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          mobile: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="mobile"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Mobile
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="adhaar"
                      type="number"
                      value={userDetails.adhaar}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          adhaar: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="adhaar"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Aadhar/PAN no.
                    </label>
                  </div>
                  <div className="relative text-gray-400 border-b-2 rounded">
                    Correspondance Address
                  </div>
                  <div className="relative">
                    <input
                      id="address"
                      type="text"
                      value={userDetails.address}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          address: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="address"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Address
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="district"
                      type="text"
                      value={userDetails.district}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          district: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="district"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      District
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="state"
                      type="text"
                      value={userDetails.state}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          state: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="state"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      State
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="country"
                      type="text"
                      value={userDetails.country}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          country: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="country"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Country
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="pin"
                      type="number"
                      value={userDetails.pin}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          pin: e.target.value,
                        })
                      }
                      className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="pin"
                      className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                      Pin/Zip Code
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-md lg:col-span-4 lg:mt-0"
            >
              <h2
                id="summary-heading"
                className="border-b border-gray-700 px-4 py-3 my-3 text-lg font-medium text-white"
              >
                Price Details
              </h2>
              <div className="bg-gray-800 px-4 py-6 rounded-xl">
                <dl className="space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-md text-gray-300 font-bold">
                      Enter Amount
                    </dt>
                    <dd className="text-sm font-medium text-gray-300">
                      <input
                        type="number"
                        placeholder="Amount in INR"
                        value={userDetails.amount}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            amount: e.target.value,
                          })
                        }
                        className="bg-gray-700 border border-gray-600 px-3 py-2 w-32 rounded-md outline-none placeholder-gray-400 text-white focus:ring-2 focus:ring-gray-500"
                      />
                    </dd>
                  </div>
                  {/* Other price details... */}
                  <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                    <dt className="text-base font-medium text-white">
                      Total Amount
                    </dt>
                    <dd className="text-base font-medium text-white">
                      {userDetails.amount}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={userDetailsFunction}
                    className="w-full px-4 py-3 text-center text-white bg-gray-700 border border-gray-600 hover:bg-gray-600 rounded-xl transition duration-300"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryForm;
