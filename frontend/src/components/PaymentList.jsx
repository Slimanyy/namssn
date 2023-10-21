import { useAllPaymentsQuery, setCategories } from "../redux"; // Import Redux Toolkit Query hook and action creator
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HeaderComponent } from "../components";

const PaymentList = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	// Use the useAllPaymentsQuery hook to fetch payments
	const { data: payments, isLoading, isError } = useAllPaymentsQuery();

	if (!isLoading && !isError && Array.isArray(payments)) {
		// Set categories in the Redux store
		dispatch(setCategories(payments));
	}

	return (
		<div className="flex flex-row w-full">
			{/* <Sidebar /> */}
			<div className="w-full h-full flex flex-col">
				<HeaderComponent title="Payments" />
				<div className="flex md:flex-row flex-col-reverse w-full h-full">
					<div className="h-full">
						<h1 className="px-4 py-2 text-2xl font-semibold text-gray-700">
							Payments to be Made
						</h1>
						{isLoading ? (
							<p>Loading...</p>
						) : isError ? (
							<p>Error loading payments</p>
						) : !payments ||
				!Array.isArray(payments) || payments.length === 0 ? (
							<p>No payments to be made at the moment.</p>
						) : (
							<ul>
								{payments.map((payment) => (
									<li
										key={payment._id}
										className="shadow-3xl flex flex-row  justify-between items-center rounded-2xl m-8 p-4 gap-5 md:gap-20 pr-5 md:pr-14"
									>
										<div className="flex flex-col">
											<p>Category: {payment.name}</p>
											<p>Session: {payment.session}</p>
											<div className="py-4 flex flex-row items-center gap-2">
												Amount :{" "}
												<span className="text-xl font-semibold">
													#{payment.amount}
												</span>
											</div>
										</div>
										<div className="border-gray-500 border-2 rounded-xl flex flex-row p-2 text-xl font-semibold hover:bg-black hover:text-white transition-all duration-300">
											<Link
												to={`/payments/pay/${payment._id}`}
											>
												Pay Now
											</Link>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>

					<Link
						className="hover:bg-slate-500 p-2 text-white rounded-lg bg-slate-700 my-5 h-fit flex m-auto"
						to={`/payments/${userInfo._id}`}
					>
						View Payments History
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentList;
