import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, setCurrentPage } from "../../redux/slices/courseSlice";
import Navbar from "../../components/common/Navbar";

const CourseList = () => {
  const dispatch = useDispatch();
  const { items: courses, loading, totalPages, currentPage } =
    useSelector((state) => state.courses);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All", "Programming", "Design", "Business",
    "Marketing", "Music", "Photography"
  ];

  useEffect(() => {
    dispatch(fetchCourses({ page: currentPage, size: 9 }));
  }, [dispatch, currentPage]);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      category === "All" || c.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>All Courses</h1>
        <p style={styles.headerSub}>
          Explore our wide range of courses
        </p>
      </div>

      <div style={styles.container}>
        {/* Search + Filter */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  ...styles.catBtn,
                  ...(category === cat ? styles.catBtnActive : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p style={styles.resultCount}>
          Showing {filtered.length} courses
        </p>

        {/* Courses Grid */}
        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner}>⏳</div>
            <p>Loading courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "48px" }}>📭</p>
            <p style={styles.emptyText}>No courses found</p>
            <p style={{ color: "#999" }}>
              Try a different search or category
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((course) => (
              <div key={course.id} style={styles.card}>
                {/* Thumbnail */}
                <div style={styles.thumb}>
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      style={styles.thumbImg}
                    />
                  ) : (
                    <div style={styles.thumbPlaceholder}>📚</div>
                  )}
                  <span style={styles.levelBadge}>
                    {course.level || "All Levels"}
                  </span>
                </div>

                {/* Body */}
                <div style={styles.cardBody}>
                  <span style={styles.category}>
                    {course.category || "General"}
                  </span>
                  <h3 style={styles.title}>{course.title}</h3>
                  <p style={styles.instructor}>
                    👨‍🏫 {course.instructorName}
                  </p>
                  <p style={styles.description}>
                    {course.description?.substring(0, 80)}
                    {course.description?.length > 80 ? "..." : ""}
                  </p>

                  <div style={styles.meta}>
                    <span>📖 {course.totalLessons} lessons</span>
                    <span>👥 {course.totalStudents} students</span>
                  </div>

                  <div style={styles.footer}>
                    <span style={styles.price}>
                      {course.price === 0
                        ? "FREE"
                        : `₹${course.price}`}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      style={styles.viewBtn}
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => dispatch(setCurrentPage(i))}
                style={{
                  ...styles.pageBtn,
                  ...(currentPage === i ? styles.pageBtnActive : {}),
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "60px 24px",
    textAlign: "center",
    color: "white",
  },
  headerTitle: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "12px",
  },
  headerSub: {
    fontSize: "18px",
    opacity: 0.85,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  filterBar: {
    marginBottom: "32px",
  },
  searchInput: {
    width: "100%",
    padding: "14px 20px",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "16px",
    outline: "none",
    boxSizing: "border-box",
  },
  categories: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  catBtn: {
    padding: "8px 18px",
    border: "2px solid #e1e5e9",
    borderRadius: "24px",
    background: "white",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
    cursor: "pointer",
  },
  catBtnActive: {
    border: "2px solid #667eea",
    background: "#667eea",
    color: "white",
  },
  resultCount: {
    color: "#888",
    marginBottom: "24px",
    fontSize: "14px",
  },
  loading: {
    textAlign: "center",
    padding: "80px",
    color: "#666",
  },
  spinner: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  empty: {
    textAlign: "center",
    padding: "80px",
    color: "#666",
  },
  emptyText: {
    fontSize: "22px",
    fontWeight: "600",
    margin: "16px 0 8px",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  thumb: {
    height: "190px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  thumbPlaceholder: {
    fontSize: "64px",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  levelBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  cardBody: {
    padding: "20px",
  },
  category: {
    background: "#f0f0ff",
    color: "#667eea",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    fontSize: "17px",
    fontWeight: "700",
    margin: "10px 0 6px",
    color: "#1a1a2e",
    lineHeight: 1.4,
  },
  instructor: {
    color: "#666",
    fontSize: "13px",
    marginBottom: "8px",
  },
  description: {
    color: "#888",
    fontSize: "13px",
    lineHeight: 1.6,
    marginBottom: "12px",
  },
  meta: {
    display: "flex",
    gap: "16px",
    color: "#999",
    fontSize: "12px",
    marginBottom: "16px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#667eea",
  },
  viewBtn: {
    padding: "9px 18px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "48px",
  },
  pageBtn: {
    width: "40px",
    height: "40px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  pageBtnActive: {
    background: "#667eea",
    border: "2px solid #667eea",
    color: "white",
  },
};

export default CourseList;