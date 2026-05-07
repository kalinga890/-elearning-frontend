import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourseById } from "../../api/courseAPI";
import { getCourseReviews, getAverageRating } from "../../api/reviewAPI";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";
import { createOrder, verifyPayment } from "../../api/paymentAPI";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] =
    useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [courseRes, reviewsRes, ratingRes] =
        await Promise.all([
          getCourseById(id),
          getCourseReviews(id),
          getAverageRating(id),
        ]);
      setCourse(courseRes.data);
      setReviews(reviewsRes.data);
      setAvgRating(ratingRes.data.averageRating || 0);
    } catch (error) {
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!currentUser) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      const orderRes = await createOrder(id);
      const orderData = orderRes.data;

      // Free course
      if (orderData.free) {
        toast.success(orderData.message);
        navigate("/dashboard");
        return;
      }

      // Paid course — open Razorpay with UPI + QR
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "ELearn",
        description: orderData.courseTitle,
        order_id: orderData.orderId,

        // ✅ All payment methods including UPI + QR
        method: {
          upi: true,
          qr: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        // ✅ Show UPI first
        config: {
          display: {
            blocks: {
              utib: {
                name: "Pay using UPI",
                instruments: [{ method: "upi" }],
              },
            },
            sequence: ["block.utib"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
              courseId: id,
            });
            if (verifyRes.data.success) {
              toast.success(
                "🎉 Payment successful! Enrolled!"
              );
              navigate("/dashboard");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: currentUser.displayName || "",
          email: currentUser.email || "",
        },

        theme: {
          color: "#667eea",
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setEnrolling(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Enrollment failed"
      );
      setEnrolling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser) {
      toast.error("Please login to review");
      return;
    }
    setSubmittingReview(true);
    try {
      await axiosInstance.post(`/reviews/${id}`, reviewForm);
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      loadData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.loading}>
          <p style={{ fontSize: "48px" }}>⏳</p>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Navbar />
        <div style={styles.loading}>
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />

      {/* Course Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.breadcrumb}>
            <span
              onClick={() => navigate("/courses")}
              style={styles.breadcrumbLink}
            >
              Courses
            </span>
            {" › "}
            <span>{course.category || "General"}</span>
          </div>
          <h1 style={styles.courseTitle}>{course.title}</h1>
          <p style={styles.courseDesc}>{course.description}</p>
          <div style={styles.courseMeta}>
            <span>👨‍🏫 {course.instructorName}</span>
            <span>
              ⭐ {avgRating} ({reviews.length} reviews)
            </span>
            <span>📖 {course.totalLessons} lessons</span>
            <span>👥 {course.totalStudents} students</span>
          </div>
          <div style={styles.badges}>
            {course.level && (
              <span style={styles.badge}>{course.level}</span>
            )}
            {course.category && (
              <span style={styles.badge}>
                {course.category}
              </span>
            )}
          </div>
        </div>

        {/* Enroll Card */}
        <div style={styles.enrollCard}>
          <div style={styles.courseThumb}>
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                style={styles.thumbImg}
              />
            ) : (
              <div style={styles.thumbPlaceholder}>📚</div>
            )}
          </div>
          <div style={styles.enrollBody}>
            <div style={styles.priceTag}>
              {course.price === 0
                ? "FREE"
                : `₹${course.price}`}
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              style={{
                ...styles.enrollBtn,
                opacity: enrolling ? 0.7 : 1,
              }}
            >
              {enrolling ? "Processing..." : "Enroll Now"}
            </button>

            {/* Payment Icons */}
            <div style={styles.paymentIcons}>
              <span style={styles.payIcon}>💳 Card</span>
              <span style={styles.payIcon}>📱 UPI</span>
              <span style={styles.payIcon}>🏦 Netbanking</span>
            </div>

            <div style={styles.includes}>
              <p style={styles.includesTitle}>
                This course includes:
              </p>
              <p style={styles.includeItem}>
                📖 {course.totalLessons} lessons
              </p>
              <p style={styles.includeItem}>
                👥 {course.totalStudents} enrolled students
              </p>
              <p style={styles.includeItem}>
                🏆 Certificate on completion
              </p>
              <p style={styles.includeItem}>
                ♾️ Full lifetime access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Write Review */}
        {currentUser && (
          <div
            style={{ ...styles.section, marginBottom: "24px" }}
          >
            <h2 style={styles.sectionTitle}>
              ✍️ Write a Review
            </h2>
            <div style={styles.starRating}>
              <p style={styles.ratingLabel}>Your Rating:</p>
              <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setReviewForm({
                        ...reviewForm,
                        rating: star,
                      })
                    }
                    style={{
                      fontSize: "32px",
                      cursor: "pointer",
                      color:
                        star <= reviewForm.rating
                          ? "#ffd700"
                          : "#ddd",
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={styles.ratingNum}>
                  {reviewForm.rating}/5
                </span>
              </div>
            </div>
            <textarea
              placeholder="Share your experience..."
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value,
                })
              }
              style={styles.reviewTextarea}
              rows={4}
            />
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              style={{
                ...styles.submitReviewBtn,
                opacity: submittingReview ? 0.7 : 1,
              }}
            >
              {submittingReview
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        )}

        {/* Reviews */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            ⭐ Student Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div style={styles.noReviews}>
              <p style={{ fontSize: "40px" }}>💬</p>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div style={styles.reviewsGrid}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={styles.reviewCard}
                >
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewAvatar}>
                      {review.studentName
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p style={styles.reviewName}>
                        {review.studentName}
                      </p>
                      <div>
                        {Array.from(
                          { length: 5 },
                          (_, i) => (
                            <span
                              key={i}
                              style={{
                                color:
                                  i < review.rating
                                    ? "#ffd700"
                                    : "#ddd",
                                fontSize: "16px",
                              }}
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <p style={styles.reviewComment}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    textAlign: "center",
    padding: "100px",
    color: "#666",
    fontSize: "18px",
  },
  hero: {
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    padding: "60px 24px",
    display: "flex",
    justifyContent: "center",
    gap: "48px",
    flexWrap: "wrap",
    color: "white",
  },
  heroContent: {
    maxWidth: "620px",
    flex: 1,
  },
  breadcrumb: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
    marginBottom: "20px",
  },
  breadcrumbLink: {
    cursor: "pointer",
    color: "#667eea",
  },
  courseTitle: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "16px",
    lineHeight: 1.3,
  },
  courseDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "16px",
    lineHeight: 1.7,
    marginBottom: "20px",
  },
  courseMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "14px",
    marginBottom: "16px",
  },
  badges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  badge: {
    background: "rgba(102,126,234,0.3)",
    border: "1px solid rgba(102,126,234,0.5)",
    color: "#a5b4fc",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  enrollCard: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    width: "320px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    alignSelf: "flex-start",
  },
  courseThumb: {
    height: "180px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbPlaceholder: {
    fontSize: "60px",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  enrollBody: {
    padding: "24px",
  },
  priceTag: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#667eea",
    marginBottom: "16px",
  },
  enrollBtn: {
    width: "100%",
    padding: "14px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "700",
    marginBottom: "12px",
    cursor: "pointer",
  },
  paymentIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  payIcon: {
    background: "#f0f0ff",
    color: "#667eea",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
  },
  includes: {
    borderTop: "1px solid #f0f0f0",
    paddingTop: "16px",
  },
  includesTitle: {
    fontWeight: "700",
    marginBottom: "12px",
    color: "#333",
    fontSize: "14px",
  },
  includeItem: {
    color: "#555",
    fontSize: "13px",
    marginBottom: "8px",
    lineHeight: 1.5,
  },
  mainContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "48px 24px",
  },
  section: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#1a1a2e",
  },
  starRating: {
    marginBottom: "16px",
  },
  ratingLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  stars: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  ratingNum: {
    marginLeft: "8px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "600",
  },
  reviewTextarea: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e1e5e9",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  submitReviewBtn: {
    padding: "12px 32px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  noReviews: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    background: "#f8f9fa",
    borderRadius: "12px",
  },
  reviewsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  reviewCard: {
    background: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  reviewAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
  reviewName: {
    fontWeight: "600",
    color: "#333",
    fontSize: "14px",
    marginBottom: "4px",
  },
  reviewComment: {
    color: "#555",
    fontSize: "13px",
    lineHeight: 1.6,
  },
};

export default CourseDetail;