import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/register" style={styles.link}>Register</Link>
      <Link to="/login" style={styles.link}>Login</Link>
      <Link to="/profile" style={styles.link}>Profile</Link>
      <Link to="/wishlist" style={styles.link}>Wishlist</Link>

    </nav>
  );
}

const styles = {
  nav: { display: "flex", gap: "20px", padding: "10px", background: "#007bff" },
  link: { color: "#fff", textDecoration: "none", fontWeight: "bold" }
};
