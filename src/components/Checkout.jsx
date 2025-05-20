import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './Checkout.module.scss';

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [epaycoLoaded, setEpaycoLoaded] = useState(false);
  
  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; 
  const shipping = state.items.length > 0 ? 9.99 : 0;
  const total = subtotal + tax + shipping;
  
  const saveOrderToFirestore = async () => {
    
    const reference = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
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
    if (!epaycoLoaded) {
      alert("Payment system is still loading. Please try again in a moment.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const order = await saveOrderToFirestore();
      if (!order) {
        setIsLoading(false);
        return;
      }
      
      const responseUrl = new URL('/payment-response', window.location.origin);
      responseUrl.searchParams.append('orderId', order.orderId);
      
      const handler = window.ePayco.checkout.configure({
        key: '78498d8c6d5cecaba462c0758054f172', 
        test: true 
      });
      
      handler.open({
        external: false,
        name: 'Fitness Hub Order',
        description: `Order with ${state.totalItems} items`,
        invoice: order.reference,
        currency: 'cop',
        amount: total.toFixed(2),
        tax_base: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        country: 'co',
        lang: 'en',
        
        name_billing: user?.displayName || user?.email || 'Customer',
        email_billing: user?.email || '',
        
        response: responseUrl.toString(),
        confirmation: responseUrl.toString(),
        
        extra1: order.orderId,
      });
    } catch (error) {
      console.error("Error during checkout process:", error);
      alert("There was an error processing your checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadEpayco = () => {
      if (window.ePayco) {
        setEpaycoLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.epayco.co/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log("ePayco script loaded successfully");
        setEpaycoLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load ePayco script");
      };
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };
    
    loadEpayco();
  }, []);

  return (
    <button 
      className={`${styles.checkoutbutton} ${isLoading ? styles.loading : ''}`}
      onClick={handleCheckout} 
      disabled={state.items.length === 0 || isLoading || !epaycoLoaded}
    >
      {isLoading ? 'Processing...' : 'Proceed to Checkout'}
    </button>
  );
};

export default Checkout;