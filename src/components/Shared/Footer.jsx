import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.sections}>
        <div className={styles.column}>
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Our Team</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Accessibility</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>Follow Us</h3>
          <ul>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Fitness Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
