import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config'; // Import your Firebase config
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './Checkout.module.scss';

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Calculate totals
  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = state.items.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;
  
  // Save order to Firestore before redirecting to payment
  const saveOrderToFirestore = async () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { state: { returnUrl: '/cart' } });
      return null;
    }
    
    // Create a unique reference for this order
    const reference = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      // Save order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        items: state.items,
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        reference,
        createdAt: serverTimestamp()
      });
      
      // Return the order reference and ID
      return {
        reference,
        orderId: orderRef.id
      };
    } catch (error) {
      console.error('Error saving order:', error);
      return null;
    }
  };
  
  const handleCheckout = async () => {
    // First save the order to Firestore
    const order = await saveOrderToFirestore();
    if (!order) return;
    
    // Configure ePayco parameters
    const handler = window.ePayco.checkout.configure({
      key: '78498d8c6d5cecaba462c0758054f172',
      test: true // Set to false in production
    });
    
    // Open payment window
    handler.open({
      external: 'false',
      name: 'Fitness Hub Order',
      description: `Order with ${state.totalItems} items`,
      invoice: order.reference,
      currency: 'cop', // or 'usd', etc.
      amount: total.toFixed(2),
      tax_base: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      country: 'co', // Country code
      lang: 'en',
      
      // Customer info
      name_billing: user?.displayName || '',
      email_billing: user?.email || '',
      
      // Response URLs - frontend routes
      response: `${window.location.origin}/payment-response?orderId=${order.orderId}`,
      
      // Pass order ID as extra data
      extra1: order.orderId
    });
  };

  // Load ePayco script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.epayco.co/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <button 
      className={styles.checkoutbutton} 
      onClick={handleCheckout} 
      disabled={state.items.length === 0}
    >
      Proceed to Checkout
    </button>
  );
};

export default Checkout;