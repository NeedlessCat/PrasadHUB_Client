import Layout from "../../components/Layout/layout";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/firebaseConfig";
import hero2 from "../../assets/hero3.jpeg";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

// Retrieve Razorpay key from environment variables
const RAZORPAY_KEY_ID = import.meta.env.RAZORPAY_KEY_ID;

const DeliveryForm = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const navigate = useNavigate();

  // Close Razorpay modal and stop loading
  useEffect(() => {
    if (!isRazorpayOpen) {
      setLoading(false);
    }
  }, [isRazorpayOpen, setLoading]);

  // User details state
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

  // Function to handle user details submission and payment
  const handleUserDetailsSubmission = async () => {
    // Validation
    if (Object.values(userDetails).some((value) => value.trim() === "")) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    // Create user object
    const user = {
      ...userDetails,
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    try {
      // Create Razorpay order
      const response = await fetch(
        "https://prasadhub-server.onrender.com/create-razorpay-order",
        // "http://localhost:3001/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseInt(userDetails.amount * 100),
            currency: "INR",
            receipt: `order_rcptid_${user.name}`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await response.json();

      // Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: parseInt(userDetails.amount * 100),
        currency: "INR",
        order_receipt: `order_rcptid_${user.name}`,
        name: "PrasadHUB",
        description: "for testing purpose",
        order_id: orderData.id,
        handler: async function (response) {
          await handlePaymentSuccess(response, user);
        },
        modal: {
          ondismiss: handlePaymentFailure,
        },
        theme: { color: "#3399cc" },
      };

      // Open Razorpay payment modal
      const paymentObject = new window.Razorpay(options);
      setIsRazorpayOpen(true);
      paymentObject.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response, user) => {
    try {
      if (
        !response.razorpay_payment_id ||
        !response.razorpay_order_id ||
        !response.razorpay_signature
      ) {
        throw new Error("Missing required Razorpay parameters");
      }

      // Verify payment
      const verifyResponse = await fetch(
        "https://prasadhub-server.onrender.com/verify-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            email: userDetails.email,
            name: userDetails.name,
            mobile: userDetails.mobile,
            role: userDetails.role,
          }),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed");
      }

      const verifyData = await verifyResponse.json();

      if (verifyData.verified) {
        toast.success("Payment Successful!");

        // Save order information to Firestore
        const orderInfo = {
          ...user,
          status: "Approved",
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

        // Reset form and navigate
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
          role: "delivery",
        });
        setLoading(false);
        navigate("/");
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle payment failure or modal dismissal
  const handlePaymentFailure = () => {
    setIsRazorpayOpen(false);
    setLoading(false);
    toast.error("Payment cancelled or popup closed");
  };

  // Render form fields
  const renderFormField = (id, label, value, onChange, type = "text") => (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 border border-gray-600 px-4 py-3 w-full rounded-md outline-none text-white focus:ring-2 focus:ring-gray-500 peer"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute rounded-md text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-gray-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {label}
      </label>
    </div>
  );

  return (
    <Layout>
      {/* Background image and overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${hero2})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Form content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-1 pt-32 px-4 sm:px-2 lg:px-4">
        <div className="max-w-7xl w-full space-y-8 bg-gray-900 p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            Donation Form
          </h1>

          {/* New Guidelines Section */}
          <div className="bg-gray-800 px-6 py-4 rounded-xl text-white">
            <h2 className="text-xl font-semibold mb-3">Guidelines:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>The minimum donation amount is 1001 rupees.</li>
              <li>
                A receipt will be sent to the email address you provide, so
                please ensure it is entered correctly.
              </li>
              <li>
                Please fill in all details accurately to avoid any confusion.
              </li>
              <li>Donations received are not refundable.</li>
            </ul>
          </div>

          {loading && <Loader />}
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Personal details section */}
            <section className="rounded-lg lg:col-span-8">
              <div className="bg-gray-800 px-4 py-6 sm:p-8 border border-gray-700 rounded-xl shadow-md">
                <div className="space-y-4">
                  <div className="relative text-gray-400 border-b-2 rounded">
                    <p className="pl-1">Personal Details</p>
                  </div>
                  {renderFormField(
                    "fullName",
                    "Full Name",
                    userDetails.name,
                    (value) => setUserDetails({ ...userDetails, name: value })
                  )}
                  {renderFormField(
                    "father",
                    "S/o/W/o/D/o Name",
                    userDetails.father,
                    (value) => setUserDetails({ ...userDetails, father: value })
                  )}

                  <div className="relative text-gray-400 border-b-2 rounded">
                    <p className="pl-1">Contact Details</p>
                  </div>
                  {renderFormField(
                    "emailAddress",
                    "Email Address",
                    userDetails.email,
                    (value) => setUserDetails({ ...userDetails, email: value }),
                    "email"
                  )}
                  {renderFormField(
                    "mobile",
                    "Mobile",
                    userDetails.mobile,
                    (value) =>
                      setUserDetails({ ...userDetails, mobile: value }),
                    "number"
                  )}
                  {renderFormField(
                    "adhaar",
                    "Aadhar/PAN no.",
                    userDetails.adhaar,
                    (value) =>
                      setUserDetails({ ...userDetails, adhaar: value }),
                    "number"
                  )}

                  <div className="relative text-gray-400 border-b-2 rounded">
                    <p className="pl-1">Correspondence Address</p>
                  </div>
                  {renderFormField(
                    "address",
                    "Address",
                    userDetails.address,
                    (value) =>
                      setUserDetails({ ...userDetails, address: value })
                  )}
                  {renderFormField(
                    "district",
                    "District",
                    userDetails.district,
                    (value) =>
                      setUserDetails({ ...userDetails, district: value })
                  )}
                  {renderFormField(
                    "state",
                    "State",
                    userDetails.state,
                    (value) => setUserDetails({ ...userDetails, state: value })
                  )}
                  {renderFormField(
                    "country",
                    "Country",
                    userDetails.country,
                    (value) =>
                      setUserDetails({ ...userDetails, country: value })
                  )}
                  {renderFormField(
                    "pin",
                    "Pin/Zip Code",
                    userDetails.pin,
                    (value) => setUserDetails({ ...userDetails, pin: value }),
                    "number"
                  )}
                </div>
              </div>
            </section>

            {/* Order summary section */}
            <section className="mt-16 rounded-md lg:col-span-4 lg:mt-0">
              <h2 className="border-b border-gray-700 px-4 py-3 my-3 text-lg font-medium text-white">
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
                    onClick={handleUserDetailsSubmission}
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
