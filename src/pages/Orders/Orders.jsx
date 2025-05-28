// pages/Orders/Orders.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Remove orderBy
import Header from '../../components/Shared/Header';
import Footer from '../../components/Shared/Footer';
import { useNavigate } from 'react-router-dom';
import styles from './Orders.module.scss';
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Orders = () => {
  useDocumentTitle("My Orders | proyecto EyA");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Remove orderBy from the query to avoid index requirement
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = [];

        querySnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Sort on the client side instead
        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });

        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return styles.statusDefault;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.ordersContainer}>
          <div className={styles.loading}>
            <p>Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.ordersContainer}>
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.ordersContainer}>
        <div className={styles.ordersHeader}>
          <h1>My Orders</h1>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/store')}
          >
            ← Back to Store
          </button>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
            <button 
              className={styles.shopButton}
              onClick={() => navigate('/store')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3>Order #{order.reference}</h3>
                    <p className={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className={styles.orderStatus}>
                    <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items?.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <img 
                          src={item.image || "/placeholder.svg"} 
                          alt={item.name} 
                          width={50} 
                          height={50} 
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <div className={styles.itemTotal}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderTotal}>
                    <strong>Total: ${order.total?.toFixed(2)}</strong>
                  </div>
                  {order.paymentDetails?.transactionId && (
                    <div className={styles.transactionId}>
                      Transaction: {order.paymentDetails.transactionId}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;