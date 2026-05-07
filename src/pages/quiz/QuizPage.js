import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const res = await axiosInstance.get(`/quiz/${quizId}`);
      setQuiz(res.data);
    } catch (error) {
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions?.length) {
      toast.error("Please answer all questions!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(
        `/quiz/${quizId}/submit`,
        { answers }
      );
      setResult(res.data);
      toast.success("Quiz submitted!");
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.center}>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Navbar />
        <div style={styles.resultContainer}>
          <div style={styles.resultCard}>
            <div style={styles.resultIcon}>
              {result.passed ? "🏆" : "📚"}
            </div>
            <h2 style={styles.resultTitle}>
              {result.passed
                ? "Congratulations!"
                : "Keep Learning!"}
            </h2>
            <div style={styles.scoreCircle}>
              <span style={styles.scoreNum}>
                {result.score}%
              </span>
              <span style={styles.scoreLabel}>Score</span>
            </div>
            <div style={styles.resultStats}>
              <div style={styles.resultStat}>
                <span style={styles.statNum}>
                  {result.correctAnswers}
                </span>
                <span style={styles.statLabel}>Correct</span>
              </div>
              <div style={styles.resultStat}>
                <span style={styles.statNum}>
                  {result.totalQuestions}
                </span>
                <span style={styles.statLabel}>Total</span>
              </div>
              <div style={styles.resultStat}>
                <span style={styles.statNum}>
                  {result.passingScore}%
                </span>
                <span style={styles.statLabel}>Passing</span>
              </div>
            </div>
            <p
              style={{
                ...styles.passStatus,
                color: result.passed ? "#4caf50" : "#f44336",
              }}
            >
              {result.passed
                ? "✅ You passed!"
                : "❌ You need " +
                  result.passingScore +
                  "% to pass. Try again!"}
            </p>

            {/* Result Buttons */}
            <div style={styles.resultButtons}>
              <button
                onClick={() => navigate("/dashboard")}
                style={styles.dashBtn}
              >
                Go to Dashboard
              </button>

              {/* Show Certificate button if passed */}
              {result.passed && (
                <button
                  onClick={() =>
                    navigate(`/certificate/${result.quizId}`)
                  }
                  style={styles.certBtn}
                >
                  🏆 Get Certificate
                </button>
              )}

              {/* Show Retry button if failed */}
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setCurrentQ(0);
                  }}
                  style={styles.retryBtn}
                >
                  🔄 Retry Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const question = questions[currentQ];

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        {/* Quiz Header */}
        <div style={styles.header}>
          <h1 style={styles.quizTitle}>{quiz?.title}</h1>
          <p style={styles.quizDesc}>{quiz?.description}</p>
          <div style={styles.quizMeta}>
            <span>📝 {questions.length} Questions</span>
            <span>🎯 Pass at {quiz?.passingScore}%</span>
            <span>
              ✅ {Object.keys(answers).length} Answered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${
                ((currentQ + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>

        {/* Question Card */}
        {question && (
          <div style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <span style={styles.questionNum}>
                Question {currentQ + 1} of {questions.length}
              </span>
            </div>
            <h2 style={styles.questionText}>
              {question.question}
            </h2>

            {/* Options */}
            <div style={styles.options}>
              {["A", "B", "C", "D"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    handleAnswer(question.id, opt)
                  }
                  style={{
                    ...styles.optionBtn,
                    ...(answers[question.id] === opt
                      ? styles.optionSelected
                      : {}),
                  }}
                >
                  <span style={styles.optionLabel}>
                    {opt}
                  </span>
                  <span style={styles.optionText}>
                    {question[`option${opt}`]}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div style={styles.navigation}>
              <button
                onClick={() =>
                  setCurrentQ(Math.max(0, currentQ - 1))
                }
                disabled={currentQ === 0}
                style={{
                  ...styles.navBtn,
                  opacity: currentQ === 0 ? 0.4 : 1,
                }}
              >
                ← Previous
              </button>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  style={styles.nextBtn}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    ...styles.submitBtn,
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Quiz 🎯"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Question Navigator */}
        <div style={styles.questionNav}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              style={{
                ...styles.navDot,
                background: answers[questions[i]?.id]
                  ? "#4caf50"
                  : currentQ === i
                  ? "#667eea"
                  : "#e0e0e0",
                color:
                  answers[questions[i]?.id] || currentQ === i
                    ? "white"
                    : "#333",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  center: {
    textAlign: "center",
    padding: "100px",
    fontSize: "18px",
    color: "#666",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  header: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "16px",
    padding: "32px",
    color: "white",
    marginBottom: "24px",
    textAlign: "center",
  },
  quizTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "8px",
  },
  quizDesc: {
    opacity: 0.85,
    marginBottom: "16px",
  },
  quizMeta: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    fontSize: "14px",
    opacity: 0.9,
  },
  progressBar: {
    height: "6px",
    background: "#e0e0e0",
    borderRadius: "3px",
    marginBottom: "24px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    transition: "width 0.3s",
  },
  questionCard: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  questionHeader: {
    marginBottom: "16px",
  },
  questionNum: {
    background: "#f0f0ff",
    color: "#667eea",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  questionText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: "24px",
    lineHeight: 1.5,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
  },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    border: "2px solid #e1e5e9",
    borderRadius: "10px",
    background: "white",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "15px",
    transition: "all 0.2s",
  },
  optionSelected: {
    border: "2px solid #667eea",
    background: "#f0f0ff",
  },
  optionLabel: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  optionText: {
    color: "#333",
    flex: 1,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBtn: {
    padding: "10px 24px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  nextBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  submitBtn: {
    padding: "12px 32px",
    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
  questionNav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
  },
  navDot: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },
  resultContainer: {
    minHeight: "100vh",
    background: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  resultCard: {
    background: "white",
    borderRadius: "20px",
    padding: "48px",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  },
  resultIcon: {
    fontSize: "72px",
    marginBottom: "16px",
  },
  resultTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  scoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    color: "white",
  },
  scoreNum: {
    fontSize: "32px",
    fontWeight: "800",
  },
  scoreLabel: {
    fontSize: "12px",
    opacity: 0.85,
  },
  resultStats: {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    marginBottom: "24px",
  },
  resultStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#667eea",
  },
  statLabel: {
    fontSize: "12px",
    color: "#888",
  },
  passStatus: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "24px",
  },
  resultButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  dashBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  certBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #ffd700, #ff8c00)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },
  retryBtn: {
    padding: "12px 24px",
    background: "white",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default QuizPage;