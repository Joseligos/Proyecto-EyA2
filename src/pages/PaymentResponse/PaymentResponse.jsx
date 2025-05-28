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
        
        // Create a clean payment details object without undefined values
        const paymentDetails = {
          transactionId: data.data.x_transaction_id || '',
          reference: data.data.x_ref_payco || '',
          responseCode: data.data.x_response || '',
          responseReason: data.data.x_response_reason_text || '',
          // Only include paymentMethod if it exists
          ...(data.data.x_payment_method && { paymentMethod: data.data.x_payment_method }),
          updatedAt: new Date().toISOString()
        };
        
        // Update the order status in Firestore
        await updateDoc(doc(db, 'orders', orderId), {
          status: newStatus,
          paymentDetails
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
              
              {/* Order Items Section */}
              {order && order.items && (
                <div className={styles.orderItems}>
                  <h3>Order Items</h3>
                  <div className={styles.itemsList}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          <img 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            width={60} 
                            height={60} 
                          />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          <p className={styles.itemDescription}>{item.description}</p>
                          <div className={styles.itemPricing}>
                            <span className={styles.quantity}>Qty: {item.quantity}</span>
                            <span className={styles.price}>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal:</span>
                      <span>${order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Tax:</span>
                      <span>${order.tax?.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Shipping:</span>
                      <span>${order.shipping?.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow + ' ' + styles.total}>
                      <span><strong>Total:</strong></span>
                      <span><strong>${order.total?.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentInfo && paymentInfo.x_transaction_id && (
                <div className={styles.paymentDetails}>
                  <h3>Payment Details</h3>
                  <p><strong>Transaction ID:</strong> {paymentInfo.x_transaction_id}</p>
                  <p><strong>Reference:</strong> {paymentInfo.x_ref_payco}</p>
                  <p><strong>Amount:</strong> ${paymentInfo.x_amount}</p>
                  {paymentInfo.x_payment_method && (
                    <p><strong>Payment Method:</strong> {paymentInfo.x_payment_method}</p>
                  )}
                </div>
              )}
              
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.primaryButton} 
                  onClick={() => navigate('/orders')}
                >
                  View Orders
                </button>
                <button 
                  className={styles.secondaryButton} 
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
              
              {/* Show order items for pending payments too */}
              {order && order.items && (
                <div className={styles.orderItems}>
                  <h3>Order Items</h3>
                  <div className={styles.itemsList}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          <img 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            width={60} 
                            height={60} 
                          />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          <p className={styles.itemDescription}>{item.description}</p>
                          <div className={styles.itemPricing}>
                            <span className={styles.quantity}>Qty: {item.quantity}</span>
                            <span className={styles.price}>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {paymentInfo && paymentInfo.x_ref_payco && (
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
              {paymentInfo && paymentInfo.x_response_reason_text && (
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