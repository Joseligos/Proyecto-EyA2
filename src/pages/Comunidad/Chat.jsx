import React, { useEffect, useState, useRef } from "react";
import styles from "./Chat.module.scss";
import Header from "../../components/Shared/Header";
import Footer from "../../components/Shared/Footer";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const chatChannels = [
  { id: "suplementos", label: "Suplementos" },
  { id: "ejercicios", label: "Ejercicios" },
  { id: "rutinas", label: "Rutinas" },
];

const Chat = () => {
  useDocumentTitle("Comunidad | proyecto EyA");

  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentChannel, setCurrentChannel] = useState("suplementos");
  const [collapsed, setCollapsed] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, `messages_${currentChannel}`),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      scrollToBottom(); // scroll controlado solo dentro del chatBox
    });

    return () => unsubscribe();
  }, [currentChannel]);

  const handleSend = async () => {
    if (text.trim() === "") return;
    try {
      await addDoc(collection(db, `messages_${currentChannel}`), {
        uid: user.uid,
        email: user.email,
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
      setText("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const scrollToBottom = () => {
    const el = chatEndRef.current;
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "auto", block: "end" });
    }
  };

  return (
    <>
      <Header />
      <div className={styles.chatContainer}>
        <aside className={`${styles.sidebar} ${collapsed ? styles.closed : ""}`}>
          <div className={styles.sidebarHeader}>
            <p className={styles.sidebarTitle}>Canales de comunicación</p>
            <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "▶" : "◀"}
            </button>
          </div>
          {!collapsed && (
            <>
              <h3>Canales</h3>
              {chatChannels.map((ch) => (
                <button
                  key={ch.id}
                  className={`${styles.channelBtn} ${currentChannel === ch.id ? styles.active : ""}`}
                  onClick={() => setCurrentChannel(ch.id)}
                >
                  {ch.label}
                </button>
              ))}
              <p className={styles.comingSoon}>Más canales próximamente...</p>
            </>
          )}
        </aside>

        <main className={styles.chatMain}>
          <h1>{chatChannels.find((c) => c.id === currentChannel)?.label}</h1>

          <div className={styles.chatBox}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.uid === user.uid ? styles.own : ""}`}
              >
                <p className={styles.user}>{msg.email}</p>
                <p className={styles.text}>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Chat;
