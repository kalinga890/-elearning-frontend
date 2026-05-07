import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";

const InstructorDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Programming",
    level: "Beginner",
  });

  const categories = [
    "Programming", "Design", "Business",
    "Marketing", "Music", "Photography",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses/my");
      setCourses(res.data);
    } catch (error) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      toast.error("Title and price are required");
      return;
    }
    setCreating(true);
    try {
      await axiosInstance.post("/courses", {
        ...formData,
        price: parseFloat(formData.price),
      });
      toast.success("Course created successfully!");
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "Programming",
        level: "Beginner",
      });
      loadMyCourses();
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (courseId) => {
    try {
      await axiosInstance.put(`/courses/${courseId}/publish`);
      toast.success("Course published!");
      loadMyCourses();
    } catch (error) {
      toast.error("Failed to publish course");
    }
  };

  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.totalStudents || 0), 0
  );

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />

      <div style={styles.container}>
        {/* Banner */}
        <div style={styles.banner}>
          <div style={styles.bannerLeft}>
            <div style={styles.avatar}>
              {userProfile?.name?.charAt(0).toUpperCase() || "I"}
            </div>
            <div>
              <h1 style={styles.welcomeText}>
                Instructor Dashboard
              </h1>
              <p style={styles.welcomeSub}>
                👋 Hello, {userProfile?.name?.split(" ")[0]}!
                Share your knowledge with the world.
              </p>
            </div>
          </div>
          <div style={styles.bannerRight}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{courses.length}</span>
              <span style={styles.statLabel}>Courses</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{totalStudents}</span>
              <span style={styles.statLabel}>Students</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>
                {courses.filter((c) => c.status === "PUBLISHED").length}
              </span>
              <span style={styles.statLabel}>Published</span>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>My Courses</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={styles.createBtn}
            >
              {showCreateForm ? "✕ Cancel" : "+ Create Course"}
            </button>
          </div>

          {/* Create Course Form */}
          {showCreateForm && (
            <div style={styles.createForm}>
              <h3 style={styles.formTitle}>Create New Course</h3>
              <form onSubmit={handleCreateCourse}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Course Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Complete React JS Course"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 999"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      style={styles.input}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          level: e.target.value,
                        })
                      }
                      style={styles.input}
                    >
                      {levels.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    placeholder="Describe what students will learn..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    style={styles.textarea}
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    ...styles.submitBtn,
                    opacity: creating ? 0.7 : 1,
                  }}
                >
                  {creating ? "Creating..." : "Create Course"}
                </button>
              </form>
            </div>
          )}

          {/* Courses List */}
          {loading ? (
            <div style={styles.loading}>
              Loading your courses...
            </div>
          ) : courses.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: "64px" }}>🎓</p>
              <h3 style={styles.emptyTitle}>
                No courses yet!
              </h3>
              <p style={styles.emptyText}>
                Create your first course and start teaching
              </p>
            </div>
          ) : (
            <div style={styles.coursesList}>
              {courses.map((course) => (
                <div key={course.id} style={styles.courseRow}>
                  <div style={styles.courseThumb}>
                    📚
                  </div>
                  <div style={styles.courseInfo}>
                    <h3 style={styles.courseTitle}>
                      {course.title}
                    </h3>
                    <div style={styles.courseMeta}>
                      <span>📖 {course.totalLessons} lessons</span>
                      <span>👥 {course.totalStudents} students</span>
                      <span>💰 ₹{course.price}</span>
                    </div>
                  </div>
                  <div style={styles.courseActions}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          course.status === "PUBLISHED"
                            ? "#e8f5e9"
                            : "#fff3e0",
                        color:
                          course.status === "PUBLISHED"
                            ? "#2e7d32"
                            : "#e65100",
                      }}
                    >
                      {course.status}
                    </span>
                    {course.status === "DRAFT" && (
                      <button
                        onClick={() => handlePublish(course.id)}
                        style={styles.publishBtn}
                      >
                        Publish
                      </button>
                    )}
                    <Link
                      to={`/courses/${course.id}`}
                      style={styles.viewBtn}
                    >
                      View
                    </Link>
                  </div>
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
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  banner: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
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
    background: "rgba(102,126,234,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    border: "3px solid rgba(102,126,234,0.6)",
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
    background: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px 24px",
    textAlign: "center",
  },
  statNum: {
    display: "block",
    fontSize: "32px",
    fontWeight: "800",
    color: "#667eea",
  },
  statLabel: {
    fontSize: "12px",
    opacity: 0.7,
  },
  section: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
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
  createBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  createForm: {
    background: "#f8f9ff",
    borderRadius: "12px",
    padding: "28px",
    marginBottom: "28px",
    border: "2px solid #e8eaff",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "10px 14px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  submitBtn: {
    padding: "12px 32px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
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
  },
  coursesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  courseRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    border: "2px solid #f0f0f0",
    borderRadius: "12px",
    flexWrap: "wrap",
  },
  courseThumb: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "6px",
  },
  courseMeta: {
    display: "flex",
    gap: "16px",
    color: "#888",
    fontSize: "13px",
  },
  courseActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  publishBtn: {
    padding: "7px 16px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  viewBtn: {
    padding: "7px 16px",
    background: "#667eea",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
};

export default InstructorDashboard;