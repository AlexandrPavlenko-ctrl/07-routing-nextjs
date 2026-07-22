import React from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center" as const,
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    color: "#212529",
    marginBottom: "8px",
  },
  description: {
    fontSize: "1.1rem",
    color: "#6c757d",
    margin: 0,
  },
};

export default function NotFound(): React.JSX.Element {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page not found</h1>
      <p style={styles.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
