import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/common/Navbar";
import toast from "react-hot-toast";

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const certRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const res = await axiosInstance.get(
        `/courses/${courseId}`
      );
      setCourse(res.data);
    } catch (error) {
      toast.error("Failed to load certificate");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const cert = certRef.current;
    if (!cert) return;

    // Create a printable version
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${course?.title}</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${cert.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.loading}>
          <p style={{ fontSize: "48px" }}>⏳</p>
          <p>Generating your certificate...</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backBtn}
        >
          ← Back to Dashboard
        </button>
        <div style={styles.actionBtns}>
          <button
            onClick={handleDownload}
            style={styles.downloadBtn}
          >
            🖨️ Print Certificate
          </button>
          <button
            onClick={() => navigate("/courses")}
            style={styles.moreBtn}
          >
            📚 More Courses
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div style={styles.certWrapper}>
        <div ref={certRef} style={styles.certificate}>
          {/* Border Decoration */}
          <div style={styles.outerBorder}>
            <div style={styles.innerBorder}>

              {/* Header */}
              <div style={styles.certHeader}>
                <div style={styles.certLogo}>📚 ELearn</div>
                <p style={styles.certHeaderSub}>
                  Certificate of Completion
                </p>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Body */}
              <div style={styles.certBody}>
                <p style={styles.certPresents}>
                  This is to certify that
                </p>
                <h1 style={styles.studentName}>
                  {userProfile?.name || "Student"}
                </h1>
                <p style={styles.certText}>
                  has successfully completed the course
                </p>
                <h2 style={styles.courseName}>
                  {course?.title}
                </h2>
                <p style={styles.certDesc}>
                  Demonstrating proficiency and dedication
                  in mastering the course curriculum
                </p>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Footer */}
              <div style={styles.certFooter}>
                <div style={styles.certFooterLeft}>
                  <div style={styles.signature}>
                    {course?.instructorName}
                  </div>
                  <div style={styles.signatureLabel}>
                    Instructor
                  </div>
                </div>

                <div style={styles.certStamp}>
                  <div style={styles.stampCircle}>
                    <span style={styles.stampIcon}>🏆</span>
                    <span style={styles.stampText}>
                      CERTIFIED
                    </span>
                  </div>
                </div>

                <div style={styles.certFooterRight}>
                  <div style={styles.signature}>{today}</div>
                  <div style={styles.signatureLabel}>
                    Date of Completion
                  </div>
                </div>
              </div>

              {/* Certificate ID */}
              <div style={styles.certId}>
                Certificate ID: ELEARN-
                {courseId}-
                {userProfile?.id}-
                {Date.now().toString().slice(-6)}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Congrats Section */}
      <div style={styles.congrats}>
        <h2 style={styles.congratsTitle}>
          🎉 Congratulations {userProfile?.name?.split(" ")[0]}!
        </h2>
        <p style={styles.congratsText}>
          You have successfully completed{" "}
          <strong>{course?.title}</strong>.
          Share your achievement with the world!
        </p>
        <div style={styles.shareButtons}>
          <button
            style={styles.linkedinBtn}
            onClick={() =>
              window.open(
                "https://www.linkedin.com/sharing/share-offsite/?url=https://elearn.com",
                "_blank"
              )
            }
          >
            💼 Share on LinkedIn
          </button>
          <button
            style={styles.twitterBtn}
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?text=I just completed ${course?.title} on ELearn!`,
                "_blank"
              )
            }
          >
            🐦 Share on Twitter
          </button>
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
  actions: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px 24px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  backBtn: {
    padding: "10px 20px",
    background: "white",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "#555",
  },
  actionBtns: {
    display: "flex",
    gap: "12px",
  },
  downloadBtn: {
    padding: "10px 24px",
    background:
      "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  moreBtn: {
    padding: "10px 24px",
    background: "white",
    border: "2px solid #667eea",
    color: "#667eea",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  certWrapper: {
    maxWidth: "900px",
    margin: "32px auto",
    padding: "0 24px",
  },
  certificate: {
    background: "white",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    borderRadius: "4px",
  },
  outerBorder: {
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "12px",
    borderRadius: "4px",
  },
  innerBorder: {
    background: "white",
    padding: "48px",
    border: "2px solid #e8e8f8",
    borderRadius: "2px",
  },
  certHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  certLogo: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#667eea",
    marginBottom: "8px",
  },
  certHeaderSub: {
    fontSize: "16px",
    color: "#888",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  divider: {
    height: "2px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    margin: "24px 0",
    borderRadius: "1px",
  },
  certBody: {
    textAlign: "center",
    padding: "16px 0",
  },
  certPresents: {
    fontSize: "16px",
    color: "#888",
    marginBottom: "16px",
  },
  studentName: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: "16px",
    fontFamily: "Georgia, serif",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  certText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "16px",
  },
  courseName: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "16px",
  },
  certDesc: {
    fontSize: "14px",
    color: "#888",
    maxWidth: "500px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  certFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
  },
  certFooterLeft: {
    textAlign: "center",
    flex: 1,
  },
  certFooterRight: {
    textAlign: "center",
    flex: 1,
  },
  signature: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a2e",
    fontFamily: "Georgia, serif",
    borderBottom: "2px solid #667eea",
    paddingBottom: "8px",
    marginBottom: "8px",
  },
  signatureLabel: {
    fontSize: "12px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  certStamp: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  stampCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    border: "4px solid #764ba2",
    boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
  },
  stampIcon: {
    fontSize: "32px",
    marginBottom: "4px",
  },
  stampText: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "2px",
  },
  certId: {
    textAlign: "center",
    fontSize: "11px",
    color: "#bbb",
    marginTop: "16px",
    letterSpacing: "1px",
  },
  congrats: {
    maxWidth: "900px",
    margin: "0 auto 48px",
    padding: "32px 24px",
    background: "white",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  congratsTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: "12px",
  },
  congratsText: {
    color: "#666",
    fontSize: "16px",
    marginBottom: "24px",
    lineHeight: 1.6,
  },
  shareButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  linkedinBtn: {
    padding: "12px 24px",
    background: "#0077b5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  twitterBtn: {
    padding: "12px 24px",
    background: "#1da1f2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default CertificatePage;