import React, { useContext, useEffect, useRef, useState } from "react";
import myContext from "../../context/myContext";
import { DownloadTableExcel } from "react-export-table-to-excel";

const OrderDelivery = () => {
  const tableRef1 = useRef(null);
  const exportTableRef = useRef(null);
  const context = useContext(myContext);
  const { getDeliveryOrder, updateDeliveryOrder } = context;

  const [isTableReady, setIsTableReady] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderCounts, setOrderCounts] = useState({ approved: 0, delivered: 0 });

  useEffect(() => {
    // Initialize orders state with getForeignOrder data
    setOrders(getDeliveryOrder);
  }, [getDeliveryOrder]);

  useEffect(() => {
    // Set table ready state when data is available
    if (tableRef1.current && orders.length > 0) {
      setIsTableReady(true);
    }

    // Update order counts
    const approved = orders.filter(
      (order) => order.status === "Approved"
    ).length;
    const delivered = orders.filter(
      (order) => order.status === "Delivered"
    ).length;
    setOrderCounts({ approved, delivered });
  }, [orders]);

  const handleExportError = (error) => {
    console.error("Export failed:", error);
    // Add user-friendly error handling here, e.g., displaying a message to the user
  };

  // Toggle order status between 'Approved' and 'Delivered'
  const toggleStatus = async (id) => {
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? {
            ...order,
            status: order.status === "Approved" ? "Delivered" : "Approved",
          }
        : order
    );
    setOrders(updatedOrders);

    // Update the database
    const updatedOrder = updatedOrders.find((order) => order.id === id);
    await updateDeliveryOrder(updatedOrder);
  };

  // Handle input change for editable fields
  const handleInputChange = async (e, id, field) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, [field]: e.target.value } : order
    );
    setOrders(updatedOrders);

    // Update the database
    const updatedOrder = updatedOrders.find((order) => order.id === id);
    await updateDeliveryOrder(updatedOrder);
  };

  return (
    <div>
      <div>
        {/* Order count section */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Order Status Count:</h2>
          <div className="flex space-x-4">
            <div className="bg-green-100 p-2 rounded">
              <span className="font-bold">Approved:</span>{" "}
              {orderCounts.approved}
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <span className="font-bold">Delivered:</span>{" "}
              {orderCounts.delivered}
            </div>
          </div>
        </div>

        <div className="py-5 flex justify-between">
          {/* text  */}
          <h1 className=" text-xl text-pink-300 font-bold">Delivery Orders</h1>
          {isTableReady ? (
            <DownloadTableExcel
              filename="delivery_orders"
              sheet="orders"
              currentTableRef={exportTableRef.current}
              onError={handleExportError}
            >
              <button className="bg-pink-200 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded">
                Export Excel
              </button>
            </DownloadTableExcel>
          ) : (
            <button className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed">
              Loading...
            </button>
          )}
        </div>

        <table ref={exportTableRef} style={{ display: "none" }}>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Order Id</th>
              <th>Name</th>
              <th>Parent</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Aadhar/PAN</th>
              <th>Address</th>
              <th>District</th>
              <th>State</th>
              <th>Country</th>
              <th>Pin Code</th>
              <th>Role</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.father}</td>
                <td>{order.mobile}</td>
                <td>{order.email}</td>
                <td>{order.adhaar}</td>
                <td>{order.address}</td>
                <td>{order.district}</td>
                <td>{order.state}</td>
                <td>{order.country}</td>
                <td>{order.pin}</td>
                <td>{order.role}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* table  */}
        <div className="w-full overflow-x-auto">
          <table
            ref={tableRef1}
            className="w-full text-left border border-collapse sm:border-separate border-pink-100 text-pink-400"
          >
            <tbody>
              <tr>
                <th
                  scope="col"
                  className="h-12 px-6 text-md border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100 font-bold fontPara"
                >
                  S.No.
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Order Id
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Parent
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Mobile
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Aadhar/PAN
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  District
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  State
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Pin Code
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="h-12 px-6 text-md font-bold fontPara border-l first:border-l-0 border-pink-100 text-slate-700 bg-slate-100"
                >
                  Date
                </th>
              </tr>

              {orders.map((order, index) => {
                const {
                  id,
                  name,
                  mobile,
                  email,
                  role,
                  amount,
                  date,
                  address,
                  adhaar,
                  country,
                  district,
                  state,
                  father,
                  pin,
                  status,
                } = order;

                return (
                  <tr key={index} className="text-pink-300">
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500">
                      {index + 1}
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500">
                      {id}
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500">
                      <input
                        value={name}
                        onChange={(e) => handleInputChange(e, id, "name")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500">
                      <input
                        value={father}
                        onChange={(e) => handleInputChange(e, id, "father")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={mobile}
                        onChange={(e) => handleInputChange(e, id, "mobile")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={email}
                        onChange={(e) => handleInputChange(e, id, "email")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={adhaar}
                        onChange={(e) => handleInputChange(e, id, "adhaar")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={address}
                        onChange={(e) => handleInputChange(e, id, "address")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={district}
                        onChange={(e) => handleInputChange(e, id, "district")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={state}
                        onChange={(e) => handleInputChange(e, id, "state")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={country}
                        onChange={(e) => handleInputChange(e, id, "country")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <input
                        value={pin}
                        onChange={(e) => handleInputChange(e, id, "pin")}
                        className="w-full bg-transparent"
                      />
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      {role}
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      ₹{amount}
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      <button
                        onClick={() => toggleStatus(id)}
                        className={`px-2 py-1 rounded ${
                          status === "Approved" ? "bg-green-500" : "bg-blue-500"
                        } text-white`}
                      >
                        {status}
                      </button>
                    </td>
                    <td className="h-12 px-6 text-md transition duration-300 border-t border-l first:border-l-0 border-pink-100 stroke-slate-500 text-slate-500 first-letter:uppercase">
                      {date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDelivery;
