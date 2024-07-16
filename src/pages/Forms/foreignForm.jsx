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

const ForeignForm = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  // navigate
  const navigate = useNavigate();

  // UserDetails State
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    amount: "",
    role: "foreign",
  });

  /**========================================================================
   *                          User Details Function
   *========================================================================**/

  const userDetailsFunction = async () => {
    // validation
    if (
      userDetails.name.trim() === "" ||
      userDetails.email.trim() === "" ||
      userDetails.mobile.trim() === "" ||
      userDetails.amount.trim() === ""
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
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/create-razorpay-order",
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

      var options = {
        key: keyPayment,
        amount: parseInt(userDetails.amount * 100),
        currency: "INR",
        order_receipt: "order_rcptid_" + user.name,
        name: "PrasadHUB",
        description: "for testing purpose",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            if (
              !response.razorpay_payment_id ||
              !response.razorpay_order_id ||
              !response.razorpay_signature
            ) {
              throw new Error("Missing required Razorpay parameters");
            }
            const verifyResponse = await fetch(
              "http://localhost:3001/api/verify-payment",
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

            const verifyData = await verifyResponse.json();

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

              const userRefrence = collection(fireDB, "foreignForms");
              await addDoc(userRefrence, orderInfo);

              setUserDetails({
                name: "",
                email: "",
                mobile: "",
                amount: "",
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
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                    className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none placeholder-gray-400 text-white focus:ring-2 focus:ring-gray-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={userDetails.email}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, email: e.target.value })
                    }
                    className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none placeholder-gray-400 text-white focus:ring-2 focus:ring-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Mobile"
                    value={userDetails.mobile}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, mobile: e.target.value })
                    }
                    className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none placeholder-gray-400 text-white focus:ring-2 focus:ring-gray-500"
                  />
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
                className="border-b border-gray-700 px-4 py-3 text-lg font-medium text-white"
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

export default ForeignForm;
