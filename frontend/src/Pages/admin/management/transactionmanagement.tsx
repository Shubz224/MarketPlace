import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../Components/admin/AdminSidebar";
import { Order, OrderItem } from "../../../types/types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../redux/api/orderAPI";
import { Skeleton } from "../../../Components/loader";
import { responseToast } from "../../../utils/features";

const defaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  status: "Pending",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "Unknown User", _id: "" },
  _id: "",
};

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, isError, data } = useOrderDetailsQuery(params.id!);

  // Check if data is available; if not, use defaultData
  const order = data?.order || defaultData;

  const {
    shippingInfo: { address = "", city = "", state = "", country = "", pinCode = "" },
    orderItems = [],
    user: { name = "Unknown User" },
    status = "Pending",
    subtotal = 0,
    tax = 0,
    total = 0,
    discount = 0,
    shippingCharges = 0,
  } = order;

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id!,
      orderId: order._id,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id!,
      orderId: order._id,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section style={{ padding: "2rem" }}>
              <h2>Order Items</h2>
              {orderItems.length === 0 ? (
                <p>No items in this order.</p>
              ) : (
                orderItems.map((i) => (
                  <ProductCard
                    key={i._id}
                    name={i.name || "Unknown Product"}
                    photo={i.photo || ""}
                    productId={i.productId || ""}
                    _id={i._id}
                    quantity={i.quantity || 0}
                    price={i.price || 0}
                  />
                ))
              )}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`.trim() || "Address not provided"}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>Shipping Charges: ₹{shippingCharges.toFixed(2)}</p>
              <p>Tax: ₹{tax.toFixed(2)}</p>
              <p>Discount: ₹{discount.toFixed(2)}</p>
              <p>Total: ₹{total.toFixed(2)}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{(price * quantity).toFixed(2)}
    </span>
  </div>
);

export default TransactionManagement;
