import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { fireDB } from "../../firebase/firebaseConfig";
import Layout from "../../components/Layout/layout";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const UpdateForeignForm = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [formFound, setFormFound] = useState(false);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    if (!category) {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }

    try {
      const collectionName =
        category === "delivery" ? "deliveryForms" : "takeawayForm";
      const formsRef = collection(fireDB, collectionName);
      const q = query(formsRef, where("email", "==", searchTerm));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setUserDetails({ id: doc.id, ...doc.data() });
        setFormFound(true);
        setNewCategory(category);
      } else {
        toast.error(
          "No form found with the provided email in the selected category"
        );
        setFormFound(false);
      }
    } catch (error) {
      console.error("Error searching for form:", error);
      toast.error("An error occurred while searching for the form");
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const oldCollectionName =
        category === "delivery" ? "deliveryForms" : "takeawayForm";
      const newCollectionName =
        newCategory === "delivery" ? "deliveryForms" : "takeawayForm";

      if (oldCollectionName === newCollectionName) {
        // Update in the same collection
        const docRef = doc(fireDB, oldCollectionName, userDetails.id);
        await updateDoc(docRef, userDetails);
      } else {
        // Move to a new collection
        const newCollectionRef = collection(fireDB, newCollectionName);
        await addDoc(newCollectionRef, {
          ...userDetails,
          category: newCategory,
        });

        // Delete from the old collection
        const oldDocRef = doc(fireDB, oldCollectionName, userDetails.id);
        await deleteDoc(oldDocRef);
      }

      toast.success("Form updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("An error occurred while updating the form");
    }
    setLoading(false);
  };

  const renderFormField = (id, label, value, onChange, type = "text") => (
    <div className="relative mb-4">
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Update Form
          </h2>
          {loading && <Loader />}
          {!formFound ? (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setCategory("delivery")}
                  className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    category === "delivery" ? "bg-indigo-600" : "bg-gray-600"
                  } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setCategory("takeaway")}
                  className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    category === "takeaway" ? "bg-indigo-600" : "bg-gray-600"
                  } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Takeaway
                </button>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter your email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              <button
                onClick={handleSearch}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search Form
              </button>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
              <div className="flex justify-between space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setNewCategory("delivery")}
                  className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    newCategory === "delivery" ? "bg-indigo-600" : "bg-gray-600"
                  } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory("takeaway")}
                  className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    newCategory === "takeaway" ? "bg-indigo-600" : "bg-gray-600"
                  } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  Takeaway
                </button>
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
              {renderFormField(
                "email",
                "Email Address",
                userDetails.email,
                (value) => setUserDetails({ ...userDetails, email: value }),
                "email"
              )}
              {renderFormField(
                "mobile",
                "Mobile",
                userDetails.mobile,
                (value) => setUserDetails({ ...userDetails, mobile: value }),
                "tel"
              )}
              {renderFormField(
                "address",
                "Address",
                userDetails.address,
                (value) => setUserDetails({ ...userDetails, address: value })
              )}
              {renderFormField(
                "district",
                "District",
                userDetails.district,
                (value) => setUserDetails({ ...userDetails, district: value })
              )}
              {renderFormField("state", "State", userDetails.state, (value) =>
                setUserDetails({ ...userDetails, state: value })
              )}
              {renderFormField(
                "country",
                "Country",
                userDetails.country,
                (value) => setUserDetails({ ...userDetails, country: value })
              )}
              {renderFormField(
                "pin",
                "Pin/Zip Code",
                userDetails.pin,
                (value) => setUserDetails({ ...userDetails, pin: value }),
                "number"
              )}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Form
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateForeignForm;
