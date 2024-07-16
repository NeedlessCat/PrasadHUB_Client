/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import MyContext from "./myContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireDB } from "../firebase/firebaseConfig";

function MyState({ children }) {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Order State
  const [getForeignOrder, setGetForeignOrder] = useState([]);
  const [getDeliveryOrder, setGetDeliveryOrder] = useState([]);
  const [getTakeawayOrder, setGetTakeawayOrder] = useState([]);
  /**========================================================================
   *                           GET All Order Function
   *========================================================================**/

  const getForeignOrderFunction = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "foreignForms"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let orderArray = [];
        QuerySnapshot.forEach((doc) => {
          orderArray.push({ ...doc.data(), id: doc.id });
        });
        setGetForeignOrder(orderArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getDeliveryOrderFunction = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "deliveryForms"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let orderArray = [];
        QuerySnapshot.forEach((doc) => {
          orderArray.push({ ...doc.data(), id: doc.id });
        });
        setGetDeliveryOrder(orderArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const getTakeawayOrderFunction = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "takeawayForm"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let orderArray = [];
        QuerySnapshot.forEach((doc) => {
          orderArray.push({ ...doc.data(), id: doc.id });
        });
        setGetTakeawayOrder(orderArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getForeignOrderFunction();
    getDeliveryOrderFunction();
    getTakeawayOrderFunction();
  }, []);
  return (
    <MyContext.Provider
      value={{
        loading,
        setLoading,
        getForeignOrder,
        getDeliveryOrder,
        getTakeawayOrder,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyState;
