import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../redux/slices/courseSlice";
import Navbar from "../components/common/Navbar";

const Home = () => {
  const dispatch = useDispatch();
  const { items: courses, loading } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCourses({ page: 0, size: 6 }));
  }, [dispatch]);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Learn Without{" "}
            <span style={styles.highlight}>Limits</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Discover thousands of courses taught by expert
            instructors. Start learning today and advance
            your career.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/courses" style={styles.primaryBtn}>
              Explore Courses
            </Link>
            <Link to="/register" style={styles.secondaryBtn}>
              Start Teaching
            </Link>
          </div>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>10K+</span>
              <span style={styles.statLabel}>Students</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Courses</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <span style={styles.statNumber}>100+</span>
              <span style={styles.statLabel}>Instructors</span>
            </div>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardIcon}>🎓</div>
            <p style={styles.heroCardText}>
              Start your learning journey
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose ELearn?</h2>
        <div style={styles.featuresGrid}>
          {[
            {
              icon: "🎯",
              title: "Expert Instructors",
              desc: "Learn from industry professionals with real-world experience",
            },
            {
              icon: "📱",
              title: "Learn Anywhere",
              desc: "Access courses on any device, anytime, at your own pace",
            },
            {
              icon: "🏆",
              title: "Get Certified",
              desc: "Earn certificates upon course completion to boost your career",
            },
            {
              icon: "💬",
              title: "Community Support",
              desc: "Join a community of learners and get help when you need it",
            },
          ].map((feature, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>
                {feature.title}
              </h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section style={styles.coursesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Courses</h2>
          <Link to="/courses" style={styles.viewAll}>
            View All →
          </Link>
        </div>
        {loading ? (
          <div style={styles.loading}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>
              No courses yet. Be the first instructor!
            </p>
            <Link to="/register" style={styles.primaryBtn}>
              Start Teaching
            </Link>
          </div>
        ) : (
          <div style={styles.coursesGrid}>
            {courses.map((course) => (
              <div key={course.id} style={styles.courseCard}>
                <div style={styles.courseThumb}>
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      style={styles.thumbImg}
                    />
                  ) : (
                    <div style={styles.thumbPlaceholder}>
                      📚
                    </div>
                  )}
                </div>
                <div style={styles.courseBody}>
                  <span style={styles.courseCategory}>
                    {course.category || "General"}
                  </span>
                  <h3 style={styles.courseTitle}>
                    {course.title}
                  </h3>
                  <p style={styles.courseInstructor}>
                    👨‍🏫 {course.instructorName}
                  </p>
                  <div style={styles.courseMeta}>
                    <span>📖 {course.totalLessons} lessons</span>
                    <span>👥 {course.totalStudents} students</span>
                  </div>
                  <div style={styles.courseFooter}>
                    <span style={styles.coursePrice}>
                      {course.price === 0
                        ? "FREE"
                        : `₹${course.price}`}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      style={styles.enrollBtn}
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quiz Promo Section */}
      <section style={styles.quizSection}>
        <div style={styles.quizContent}>
          <div style={styles.quizLeft}>
            <span style={styles.quizBadge}>
              🧠 Test Your Knowledge
            </span>
            <h2 style={styles.quizSectionTitle}>
              Reinforce Learning with Quizzes
            </h2>
            <p style={styles.quizDesc}>
              Every course comes with interactive quizzes.
              Test your understanding and earn certificates
              by scoring 70% or higher!
            </p>
            <div style={styles.quizFeatures}>
              {[
                "📝 Multiple choice questions",
                "🎯 Instant score feedback",
                "🏆 Certificate on passing",
                "🔄 Retry as many times as needed",
              ].map((f, i) => (
                <div key={i} style={styles.quizFeatureItem}>
                  {f}
                </div>
              ))}
            </div>
            <Link to="/quiz/1" style={styles.tryQuizBtn}>
              Try a Quiz Now →
            </Link>
          </div>
          <div style={styles.quizRight}>
            <div style={styles.quizCard}>
              <div style={styles.quizCardHeader}>
                <span style={styles.quizCardTitle}>
                  React JS Basics Quiz
                </span>
                <span style={styles.quizCardBadge}>
                  5 Questions
                </span>
              </div>
              {[
                "What is React?",
                "What is JSX?",
                "What hook manages state?",
              ].map((q, i) => (
                <div key={i} style={styles.quizCardQ}>
                  <span style={styles.qNum}>{i + 1}</span>
                  <span style={styles.qText}>{q}</span>
                </div>
              ))}
              <div style={styles.quizCardFooter}>
                <span style={styles.passScore}>
                  Pass at 70%
                </span>
                <Link
                  to="/quiz/1"
                  style={styles.startQuizBtn}
                >
                  Start →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2026 ELearn. Built with ❤️ for learners everywhere.
        </p>
      </footer>
    </div>
  );
};

const styles = {
  hero: {
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "80px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "60px",
    flexWrap: "wrap",
  },
  heroContent: {
    maxWidth: "560px",
    color: "white",
  },
  heroTitle: {
    fontSize: "52px",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "20px",
  },
  highlight: {
    color: "#ffd700",
  },
  heroSubtitle: {
    fontSize: "18px",
    opacity: 0.9,
    lineHeight: 1.7,
    marginBottom: "32px",
  },
  heroButtons: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  primaryBtn: {
    padding: "14px 28px",
    background: "white",
    color: "#667eea",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "16px",
    textDecoration: "none",
    border: "none",
    display: "inline-block",
  },
  secondaryBtn: {
    padding: "14px 28px",
    background: "transparent",
    color: "white",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "16px",
    textDecoration: "none",
    border: "2px solid white",
    display: "inline-block",
  },
  stats: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#ffd700",
  },
  statLabel: {
    fontSize: "13px",
    opacity: 0.8,
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "rgba(255,255,255,0.3)",
  },
  heroImage: {
    display: "flex",
    justifyContent: "center",
  },
  heroCard: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
  },
  heroCardIcon: {
    fontSize: "80px",
    marginBottom: "16px",
  },
  heroCardText: {
    fontSize: "18px",
    fontWeight: "600",
  },
  features: {
    padding: "80px 24px",
    background: "#f8f9ff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: "48px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  featureCard: {
    background: "white",
    borderRadius: "16px",
    padding: "32px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1a1a2e",
  },
  featureDesc: {
    color: "#666",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  coursesSection: {
    padding: "80px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  viewAll: {
    color: "#667eea",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    color: "#666",
    fontSize: "18px",
  },
  empty: {
    textAlign: "center",
    padding: "60px",
  },
  emptyText: {
    color: "#666",
    fontSize: "18px",
    marginBottom: "24px",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  courseCard: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
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
  courseBody: {
    padding: "20px",
  },
  courseCategory: {
    background: "#f0f0ff",
    color: "#667eea",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  courseTitle: {
    fontSize: "17px",
    fontWeight: "700",
    margin: "12px 0 8px",
    color: "#1a1a2e",
    lineHeight: 1.4,
  },
  courseInstructor: {
    color: "#666",
    fontSize: "13px",
    marginBottom: "12px",
  },
  courseMeta: {
    display: "flex",
    gap: "16px",
    color: "#888",
    fontSize: "13px",
    marginBottom: "16px",
  },
  courseFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coursePrice: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#667eea",
  },
  enrollBtn: {
    padding: "8px 16px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
  // ── Quiz Section ──────────────────────────────────
  quizSection: {
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    padding: "80px 24px",
    color: "white",
  },
  quizContent: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    gap: "60px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  quizLeft: {
    flex: 1,
    minWidth: "300px",
  },
  quizBadge: {
    background: "rgba(102,126,234,0.3)",
    border: "1px solid rgba(102,126,234,0.5)",
    color: "#a5b4fc",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    display: "inline-block",
    marginBottom: "20px",
  },
  quizSectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "16px",
    lineHeight: 1.3,
  },
  quizDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "16px",
    lineHeight: 1.7,
    marginBottom: "24px",
  },
  quizFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "32px",
  },
  quizFeatureItem: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "15px",
  },
  tryQuizBtn: {
    padding: "14px 32px",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    display: "inline-block",
  },
  quizRight: {
    flex: 1,
    minWidth: "300px",
  },
  quizCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  quizCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  quizCardTitle: {
    fontWeight: "700",
    color: "#1a1a2e",
    fontSize: "16px",
  },
  quizCardBadge: {
    background: "#f0f0ff",
    color: "#667eea",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  quizCardQ: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  qNum: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },
  qText: {
    color: "#333",
    fontSize: "14px",
  },
  quizCardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  passScore: {
    color: "#888",
    fontSize: "13px",
    fontWeight: "600",
  },
  startQuizBtn: {
    padding: "10px 24px",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
  },
  // ── Footer ────────────────────────────────────────
  footer: {
    background: "#1a1a2e",
    padding: "32px 24px",
    textAlign: "center",
  },
  footerText: {
    color: "#aaa",
    fontSize: "14px",
  },
};

export default Home;