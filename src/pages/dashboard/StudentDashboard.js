import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const res = await axiosInstance.get("/enrollments/my");
      setEnrollments(res.data);
    } catch (error) {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logged out!");
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        {/* Welcome Banner */}
        <div style={styles.banner}>
          <div style={styles.bannerLeft}>
            <div style={styles.avatar}>
              {userProfile?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h1 style={styles.welcomeText}>
                Welcome back,{" "}
                {userProfile?.name?.split(" ")[0]}!
              </h1>
              <p style={styles.welcomeSub}>
                Continue your learning journey 🚀
              </p>
            </div>
          </div>
          <div style={styles.bannerRight}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>
                {enrollments.length}
              </span>
              <span style={styles.statLabel}>Enrolled</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>
                {enrollments.filter(
                  (e) => e.progressPercent === 100
                ).length}
              </span>
              <span style={styles.statLabel}>Completed</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>
                {enrollments.filter(
                  (e) =>
                    e.progressPercent > 0 &&
                    e.progressPercent < 100
                ).length}
              </span>
              <span style={styles.statLabel}>In Progress</span>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Courses</h2>
            <Link to="/courses" style={styles.browseBtn}>
              + Browse More
            </Link>
          </div>

          {loading ? (
            <div style={styles.loading}>
              Loading your courses...
            </div>
          ) : enrollments.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "64px" }}>📚</p>
              <h3 style={styles.emptyTitle}>No courses yet!</h3>
              <p style={styles.emptyText}>
                Start learning by enrolling in a course
              </p>
              <Link to="/courses" style={styles.exploreBtn}>
                Explore Courses
              </Link>
            </div>
          ) : (
            <div style={styles.grid}>
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} style={styles.card}>
                  <div style={styles.cardThumb}>
                    <span style={{ fontSize: "40px" }}>📚</span>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.courseTitle}>
                      {enrollment.courseTitle || "Course"}
                    </h3>
                    <p style={styles.instructor}>
                      👨‍🏫{" "}
                      {enrollment.instructorName ||
                        "Instructor"}
                    </p>

                    {/* Progress Bar */}
                    <div style={styles.progressContainer}>
                      <div style={styles.progressHeader}>
                        <span style={styles.progressLabel}>
                          Progress
                        </span>
                        <span style={styles.progressPercent}>
                          {Math.round(
                            enrollment.progressPercent || 0
                          )}%
                        </span>
                      </div>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${
                              enrollment.progressPercent || 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Continue Learning Button */}
                    <Link
                      to={`/courses/${enrollment.courseId}`}
                      style={styles.continueBtn}
                    >
                      {enrollment.progressPercent === 100
                        ? "Review Course"
                        : enrollment.progressPercent > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </Link>

                    {/* Take Quiz Button */}
                    <Link
                      to="/quiz/1"
                      style={styles.quizBtn}
                    >
                      📝 Take Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={styles.quickLinks}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.quickGrid}>
            {[
              {
                icon: "🔍",
                title: "Browse Courses",
                desc: "Find new courses to learn",
                link: "/courses",
              },
              {
                icon: "📝",
                title: "Take a Quiz",
                desc: "Test your knowledge",
                link: "/quiz/1",
              },
              {
                icon: "🏆",
                title: "My Certificates",
                desc: "View earned certificates",
                link: "/certificates",
              },
              {
                icon: "⚙️",
                title: "Profile Settings",
                desc: "Update your profile",
                link: "/profile",
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                style={styles.quickCard}
              >
                <span style={styles.quickIcon}>
                  {item.icon}
                </span>
                <h3 style={styles.quickTitle}>{item.title}</h3>
                <p style={styles.quickDesc}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  banner: {
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    padding: "36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "32px",
    color: "white",
  },
  bannerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    border: "3px solid rgba(255,255,255,0.4)",
  },
  welcomeText: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "6px",
  },
  welcomeSub: {
    opacity: 0.85,
    fontSize: "15px",
  },
  bannerRight: {
    display: "flex",
    gap: "24px",
  },
  statBox: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "16px 24px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  statNum: {
    display: "block",
    fontSize: "32px",
    fontWeight: "800",
  },
  statLabel: {
    fontSize: "12px",
    opacity: 0.85,
  },
  section: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
  },
  browseBtn: {
    padding: "8px 20px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    padding: "48px",
    color: "#999",
  },
  empty: {
    textAlign: "center",
    padding: "60px",
  },
  emptyTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#333",
    margin: "16px 0 8px",
  },
  emptyText: {
    color: "#999",
    marginBottom: "24px",
  },
  exploreBtn: {
    padding: "12px 28px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "2px solid #f0f0f0",
    borderRadius: "12px",
    overflow: "hidden",
  },
  cardThumb: {
    height: "120px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: "20px",
  },
  courseTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "6px",
  },
  instructor: {
    color: "#888",
    fontSize: "13px",
    marginBottom: "16px",
  },
  progressContainer: {
    marginBottom: "16px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  progressLabel: {
    fontSize: "12px",
    color: "#888",
  },
  progressPercent: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#667eea",
  },
  progressBar: {
    height: "6px",
    background: "#f0f0f0",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "3px",
    transition: "width 0.3s",
  },
  continueBtn: {
    display: "block",
    textAlign: "center",
    padding: "10px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  quizBtn: {
    display: "block",
    textAlign: "center",
    padding: "10px",
    background: "white",
    border: "2px solid #667eea",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    color: "#667eea",
  },
  quickLinks: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },
  quickCard: {
    background: "#f8f9ff",
    borderRadius: "12px",
    padding: "24px",
    textDecoration: "none",
    border: "2px solid transparent",
    transition: "border 0.2s",
    display: "block",
  },
  quickIcon: {
    fontSize: "36px",
    marginBottom: "12px",
    display: "block",
  },
  quickTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "6px",
  },
  quickDesc: {
    fontSize: "12px",
    color: "#888",
  },
};

export default StudentDashboard;