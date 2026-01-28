import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice.js";

const OrderManagement = () => {
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchOrders());
    }
  }, [dispatch, user, navigate]);

  // const handleStatusChange = (orderId, status) => {
  //    dispatch(updateOrderStatus({ id: orderId, status }));
  // };
  const handleStatusChange = async (orderId, status) => {
    try {
      setProcessingOrderId(orderId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await dispatch(updateOrderStatus({ id: orderId, status }));

      alert('Confirm to change order status to Delivered.');
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error:{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 uppercase text-xs text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user?.name}</td>
                  <td className="p-4">${order.totalPrice}</td>
                  <td className="p-4">
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg p-2"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {/* <button
                      className="bg-green-500 text-white rounded py-1 md:py-2 md:px-4 hover:bg-green-600 "
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                    >
                      Mark As Delivered
                    </button> */}
                    <button
                      disabled={processingOrderId === order._id}
                      className={`
                rounded py-1 px-2 md:py-2 md:px-4 text-white
                ${
                  processingOrderId === order._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }
              `}
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                    >
                      {processingOrderId === order._id
                        ? "Processing..."
                        : "Mark As Delivered"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Order Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
