import { useAuth } from "../../Store/AuthStore";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

function Booking() {
  const location = useLocation();
  const { service } = location.state || {};

  const { handleSubmit, register } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Store phone input if the user has no phone number
  const [phone, setPhone] = useState(user?.phone || "");

  const onSubmit = async () => {
    try {
      const bookingData = {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: phone, // Use state phone value
        service: service.name,
        total: service.price,
      };

      const response = await axios.post(`/addBooking`, bookingData);

      toast.success("Booking successful");
      navigate("booking-list");
    } catch (error) {
      toast.error("No service found");
      error.response && toast.error(error.response.data.message);
      console.error("Error while booking:", error.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-5">
        Confirm Your Booking
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-screen lg:w-1/2 mx-auto"
      >
        <div className="form-control w-full">
          {/* Name Input */}
          <input
            className="input input-bordered w-full my-2 bg-white text-black"
            defaultValue={user?.name}
            readOnly
          />

          {/* Email Input */}
          <input
            className="input input-bordered w-full my-2 bg-white text-black"
            defaultValue={user?.email}
            readOnly
          />

          {/* Phone Input - Editable if missing */}
          {user?.phone ? (
            <input
              className="input input-bordered w-full my-2 bg-white text-black"
              defaultValue={user.phone}
              readOnly
            />
          ) : (
            <input
              type="tel"
              className="input input-bordered w-full my-2 bg-white text-black"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}

          {/* Service Input */}
          <input
            type="text"
            readOnly
            className="input input-bordered w-full my-2 bg-white text-black"
            defaultValue={
              service?.name || "Please Visit Available Service page"
            }
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-2 mt-4 justify-between items-center">
          <p>
            Your service charge will be{" "}
            <span className="font-bold">${service?.price}</span>
          </p>

          <button
            type="submit"
            className="btn bg-[#F63E7B] px-8 py-2 text-white"
          >
            Book
          </button>
        </div>
      </form>
    </>
  );
}

export default Booking;
