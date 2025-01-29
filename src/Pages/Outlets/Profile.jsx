import { useEffect, useState } from "react";
import { useAuth } from "../../Store/AuthStore";
import noImageFound from "/assets/images/user.jpg";
import axios from "axios";
import { apiUrl } from "../../utils/config";

function Profile() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.email) {
      setLoading(true);
      axios
        .get(`/getReviews?email=${user.email}`)
        .then((response) => {
          setReviews(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 lg:mx-10 lg:mt-10">
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
          {/* Profile Image with Overlay */}
          <figure className="relative w-full">
            <img
              src={
                user.profilePic?.startsWith("https")
                  ? user.profilePic
                  : user.profilePic
                  ? `${apiUrl}/${user.profilePic}`
                  : noImageFound
              }
              className="h-full w-full object-cover rounded-2xl brightness-75 transition-all duration-300 hover:brightness-100"
              alt={user.name || "User profile"}
            />
            {/* Dark Overlay for Better Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          </figure>

          {/* User Info */}
          <div className="absolute bottom-6 left-0 w-full px-6 text-center text-primary">
            <h2 className="text-2xl font-bold drop-shadow-md">
              {user.username}
            </h2>
            <p className="text-sm text-gray-200">📧 {user.email}</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold my-5 text-center">Your Reviews</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-5 mx-auto">
            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="card w-full max-w-md mx-auto shadow-xl"
                >
                  <div className="card-body">
                    <h2 className="card-title text-blue-700">
                      Service:{" "}
                      <span className="font-bold text-[#F63E7B]">
                        {review.service}
                      </span>
                    </h2>
                    <h2 className="text-lg font-semibold text-blue-700">
                      Comments:{" "}
                      <span className="font-normal text-black">
                        {review.comment}
                      </span>
                    </h2>
                    <p>Rating: {review.rating} Out of 5</p>
                    <p>
                      Date:{" "}
                      {review.date &&
                        new Date(review.date).toLocaleString("en-US", {
                          timeZone: "Asia/Dhaka",
                        })}
                    </p>
                    <p>{review.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xl">
                You haven't made any reviews yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
