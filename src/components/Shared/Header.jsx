import React, { useState } from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logo}>
            <Link to="/">Fitness Hub</Link>
          </div>

          <nav className={styles.nav}>
            <Link to="/">Home</Link>
            <Link to="/workouts">Workouts</Link>
            <Link to="/store">Fitness Store</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/register" className={user ? styles.disabledLink : ""}>
              Join
            </Link>
            <Link to="/login" className={user ? styles.disabledLink : ""}>
              Start
            </Link>
            {user && <Link to="/chat">Comunidad</Link>}
            {user && (
              <button
                className={styles.myHubBtn}
                onClick={() => navigate("/dashboard")}
              >
                My Hub
              </button>
            )}
          </nav>

          <div className={styles.rightControls}>
            <button onClick={toggleCollapse} className={styles.toggleBtn}>
              {collapsed ? "▼ Expand" : "▲ Collapse"}
            </button>
            {user && (
              <div className={styles.userInfo}>
                {user.email}
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {!collapsed && (
          <section className={styles.infoSection}>
            <div className={styles.column}>
              <h3>Explore More</h3>
              <ul>
                <li><strong>My Profile</strong><br />Access your personalized dashboard and routines.</li>
                <li><strong>Shop Now</strong><br />Find the best fitness gear and supplements.</li>
                <li><strong>Support</strong><br />Get assistance with your fitness journey.</li>
                <li><strong>Blog</strong><br />Read our latest fitness articles and tips.</li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3>Latest Articles</h3>
              <ul>
                <li><strong>Healthy Living</strong><br />Discover tips for a balanced lifestyle.</li>
                <li><strong>Fitness Tips</strong><br />Get expert advice for your workouts.</li>
                <li><strong>Success Stories</strong><br />Be inspired by our community's achievements.</li>
                <li><strong>Events</strong><br />Join us for upcoming fitness events.</li>
              </ul>
            </div>

            <div className={styles.column}>
              <h3>From Our Blog</h3>
              <div className={styles.blogCard}>
                <div className={styles.image}></div>
                <div>
                  <strong>Fitness Journey</strong><br />
                  <span>Explore tailored workout plans for every level.</span><br />
                  <a href="#">Read more</a>
                </div>
              </div>
              <div className={styles.blogCard}>
                <div className={styles.image}></div>
                <div>
                  <strong>Article Title</strong><br />
                  <span>Learn about balanced nutrition for fitness.</span><br />
                  <a href="#">Read more</a>
                </div>
              </div>
            </div>
          </section>
        )}
      </header>
    </>
  );
};

export default Header;
