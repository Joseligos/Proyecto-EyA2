import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../../components/Shared/Header';
import Footer from '../../components/Shared/Footer';
import styles from './PaymentResponse.module.scss';

const PaymentResponse = () => {
  const [status, setStatus] = useState('processing');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchPaymentStatus = async () => {
      // Get URL parameters from ePayco redirect
      const urlParams = new URLSearchParams(location.search);
      const ref_payco = urlParams.get('ref_payco');
      const orderId = urlParams.get('orderId');
      
      if (!ref_payco || !orderId) {
        setStatus('error');
        return;
      }
      
      try {
        // 1. Get the order from Firestore
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (!orderDoc.exists()) {
          setStatus('error');
          return;
        }
        
        setOrder(orderDoc.data());
        
        // 2. Verify the transaction status with ePayco
        const response = await fetch(`https://secure.epayco.co/validation/v1/reference/${ref_payco}`);
        const data = await response.json();
        
        if (!response.ok) {
          setStatus('error');
          return;
        }
        
        setPaymentInfo(data.data);
        
        // 3. Update order status in Firestore based on payment result
        let newStatus = 'failed';
        
        if (data.data.x_response === 'Aceptada') {
          newStatus = 'completed';
          setStatus('success');
          clearCart(); // Clear the cart on successful payment
        } else if (data.data.x_response === 'Pendiente') {
          newStatus = 'pending';
          setStatus('pending');
        } else {
          setStatus('failed');
        }
        
        // Update the order status in Firestore
        await updateDoc(doc(db, 'orders', orderId), {
          status: newStatus,
          paymentDetails: {
            transactionId: data.data.x_transaction_id,
            reference: data.data.x_ref_payco,
            responseCode: data.data.x_response,
            responseReason: data.data.x_response_reason_text,
            paymentMethod: data.data.x_payment_method,
            updatedAt: new Date().toISOString()
          }
        });
        
      } catch (error) {
        console.error('Error processing payment response:', error);
        setStatus('error');
      }
    };
    
    fetchPaymentStatus();
  }, [location.search, clearCart]);

  return (
    <>
      <Header />
      <div className={styles.paymentResponseContainer}>
        <div className={styles.paymentResponse}>
          <h1>Payment {status}</h1>
          
          {status === 'processing' && (
            <div className={styles.loadingSpinner}>
              <p>Processing your payment...</p>
            </div>
          )}
          
          {status === 'success' && (
            <>
              <div className={styles.successIcon}>✓</div>
              <h2>Payment Successful!</h2>
              <p>Your order has been placed successfully.</p>
              {paymentInfo && (
                <div className={styles.paymentDetails}>
                  <p><strong>Transaction ID:</strong> {paymentInfo.x_transaction_id}</p>
                  <p><strong>Reference:</strong> {paymentInfo.x_ref_payco}</p>
                  <p><strong>Amount:</strong> ${paymentInfo.x_amount}</p>
                  <p><strong>Payment Method:</strong> {paymentInfo.x_payment_method}</p>
                </div>
              )}
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton} 
                  onClick={() => navigate('/store')}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
          
          {status === 'pending' && (
            <>
              <div className={styles.pendingIcon}>⏱</div>
              <h2>Payment Pending</h2>
              <p>Your payment is being processed. We'll update you once it's complete.</p>
              {paymentInfo && (
                <p><strong>Reference:</strong> {paymentInfo.x_ref_payco}</p>
              )}
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton} 
                  onClick={() => navigate('/store')}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
          
          {(status === 'failed' || status === 'error') && (
            <>
              <div className={styles.errorIcon}>✗</div>
              <h2>Payment Failed</h2>
              <p>There was an issue processing your payment.</p>
              {paymentInfo && (
                <p><strong>Reason:</strong> {paymentInfo.x_response_reason_text}</p>
              )}
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton} 
                  onClick={() => navigate('/cart')}
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentResponse;