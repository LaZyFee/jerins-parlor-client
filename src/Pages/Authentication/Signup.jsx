import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PrimaryButton from "../../Components/PrimaryButton";
import { useAuth } from "../../Store/AuthStore";
import PasswordStrengthMeter from "./PasswordStrentghMeter";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import logo from "/assets/images/logo.png";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSignUp = async (data) => {
    const { name, username, email, phone, password, profilePic } = data;
    console.log(data);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("profilePic", profilePic[0]);
    try {
      await signup(formData);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error signing up";
      toast.error("Error signing up: " + errorMessage);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <img src={logo} alt="signup" className="w-1/3 text-center mx-auto" />
      <div className="flex w-full flex-col">
        <div className="hero my-10">
          <div className="flex-col border border-black p-4 lg:w-1/3">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <div className="card w-full">
              <form
                className="space-y-6 mt-8"
                onSubmit={handleSubmit(handleSignUp)}
              >
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      onClick={handleRemoveImage}
                    >
                      <IoTrashOutline className="text-xl" />
                    </button>
                  </div>
                )}
                {/* Name Input */}
                <div className="form-control">
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your Name"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Username Input */}
                <div className="form-control">
                  <input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    placeholder="Username"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.username && (
                    <p className="text-red-500">{errors.username.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="form-control">
                  <input
                    type="text"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must be 11 digits",
                      },
                    })}
                    placeholder="Phone Number"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be 6 characters long",
                      },
                      pattern: {
                        value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])/,
                        message:
                          "Password must have uppercase, number, and special characters",
                      },
                    })}
                    placeholder="Password"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Password Strength Meter */}
                {password && <PasswordStrengthMeter password={password} />}

                {/* File Upload */}
                <div>
                  <label
                    htmlFor="profilePic"
                    className="flex items-center justify-center w-full py-3 bg-[#F63E7B] text-white rounded-lg cursor-pointer"
                  >
                    <IoCloudUploadOutline className="text-xl" />
                    <span className="ml-2">Upload Profile Picture</span>
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    className="hidden"
                    {...register("profilePic", {
                      required: "Profile picture is required",
                    })}
                    onChange={(e) => {
                      handleImageChange(e); // Preview the image
                      const { onChange } = register("profilePic");
                      onChange(e); // Update the form value
                    }}
                  />

                  {errors.profilePic && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.profilePic.message}
                    </p>
                  )}
                </div>
                {/* Submit Button */}
                <div className="form-control mt-6 items-end">
                  <PrimaryButton type="submit" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Create an account"}
                  </PrimaryButton>
                </div>
              </form>

              {/* Login Link */}
              <p className="text-center my-5">
                Already have an account?{" "}
                <Link className="text-[#F63E7B]" to="/login">
                  Please Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
