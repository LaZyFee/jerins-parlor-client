import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PrimaryButton from "../../Components/PrimaryButton";
import { useAuth } from "../../Store/AuthStore";
import PasswordStrengthMeter from "./PasswordStrentghMeter";
import { IoCloudUploadOutline } from "react-icons/io5";
import logo from "/assets/images/logo.png";

function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [signUpError, setSignUPError] = useState("");
  const [password, setPassword] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveSelectedImage = () => {
    setImagePreview(null);
  };

  const handleSignUp = async (data) => {
    const { name, username, email, phone, password, profilePic } = data;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("profilePic", profilePic[0]);

    try {
      await signup(formData);
      toast.success("Sign up successfully");
      navigate("/");
    } catch (error) {
      setSignUPError(error.response?.data?.message || "Error signing up");
      toast.error(signUpError);
    }
  };

  return (
    <>
      <img src={logo} alt="signup" className="w-1/3 text-center mx-auto" />
      <div className="flex w-full flex-col">
        <div className="hero my-10">
          <div className="flex-col border border-black p-4 lg:w-1/3">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <div className="card w-full">
              <form className="card-body" onSubmit={handleSubmit(handleSignUp)}>
                <div className="form-control">
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })} // "name"
                    placeholder="Your Name"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="form-control">
                  <input
                    type="text"
                    {...register("username", {
                      required: "Username is required",
                    })} // "username"
                    placeholder="Username"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.username && (
                    <p className="text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="form-control">
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })} // "email"
                    placeholder="Email"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="form-control">
                  <input
                    type="text"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must be 11 digits",
                      },
                    })} // "phone"
                    placeholder="Phone Number"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}
                </div>

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
                    })} // "password"
                    placeholder="Password"
                    className="w-full border-b border-gray-400 bg-transparent p-2 placeholder-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Capture the password input
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Render PasswordStrengthMeter only if password exists */}
                {password && <PasswordStrengthMeter password={password} />}

                <div className="form-control">
                  {imagePreview && (
                    <div className="relative my-5">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-36 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                        onClick={handleRemoveSelectedImage}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="profilePic"
                    className="btn bg-[#F63E7B] text-white w-full lg:w-1/2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <IoCloudUploadOutline /> Upload Image
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    className="hidden"
                    {...register("profilePic", {
                      validate: {
                        isImage: (fileList) => {
                          const allowedExtensions = /\.(jpg|jpeg|webp|png)$/i;
                          return (
                            fileList[0] &&
                            allowedExtensions.test(fileList[0].name) &&
                            "File must be a .jpg, .jpeg, .webp, or .png"
                          );
                        },
                      },
                    })}
                    onChange={handleFileChange}
                  />
                  {errors.profilePic && (
                    <p className="text-red-500">{errors.profilePic.message}</p>
                  )}

                  {errors.profilePic && (
                    <p className="text-red-500">{errors.profilePic.message}</p>
                  )}
                </div>

                <div className="form-control mt-6 items-end">
                  <PrimaryButton type="submit" disabled={isLoading}>
                    {isLoading ? "Signing up..." : "Create an account"}
                  </PrimaryButton>
                </div>
              </form>

              <p className="text-center">
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
