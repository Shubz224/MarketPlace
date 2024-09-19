import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../Components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userReducerInitialstate } from "../types/reducer-types";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { Skeleton } from "../Components/loader";


type DataType = {
      _id :String;
      amount:number;
      quantity:number;
      discount:number;
      status:ReactElement;
      action:ReactElement;

}
const column:Column<DataType>[]=[{
  Header:"ID",
  accessor:"_id",
},
{
  Header:"Amount",
  accessor:"amount",
},

{
  Header:"Quantity",
  accessor:"quantity",
},
{
  Header:"Discount",
  accessor:"discount",
},
{
  Header:"Status",
  accessor:"status",
},
{
  Header:"Action",
  accessor:"action"
},
]


const Orders = () => {


  const { user } = useSelector(
    (state: { userReducer: userReducerInitialstate }) => state.userReducer
  );
  


  const { isLoading, isError, error, data } = useMyOrdersQuery(user?._id!);



const[rows,setRows]= useState<DataType[]>([]);


if (isError) toast.error((error as CustomError).data.message);

useEffect(() => {
  if (data)
    setRows(
      data.orders.map((i) => ({
        _id: i._id,
        amount: i.total,
        discount: i.discount,
        quantity: i.orderItems.length,
        status: (
          <span
            className={
              i.status === "Processing"
                ? "red"
                : i.status === "Shipped"
                ? "green"
                : "purple"
            }
          >
            {i.status}
          </span>
        ),
        action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
      }))
    );
}, [data]);


























const Table = TableHOC<DataType>(
  column,
  rows,
  "dashboard-product-box",
  "Orders",
   rows.length > 6,
)();


  return  <div className="container">
     <h1>My Orders</h1>
     <main>{isLoading ? < Skeleton width="3vh" /> : Table}</main>
  </div>
}

export default Orders