import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './Checkout.module.scss';

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 200000 ? 0 : 10000; 
  const tax = subtotal * 0.19; 
  const total = subtotal + shipping + tax; 
  
  const saveOrderToFirestore = async () => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/cart' } });
      return null;
    }
    

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
    const order = await saveOrderToFirestore();
    if (!order) return;
    
    const handler = window.ePayco.checkout.configure({
      key: '78498d8c6d5cecaba462c0758054f172',
      test: true 
    });
    
    handler.open({
      external: 'false',
      name: 'Fitness Hub Order',
      description: `Order with ${state.totalItems} items`,
      invoice: order.reference,
      currency: 'cop', 
      amount: Math.round(total), 
      tax_base: Math.round(subtotal),
      tax: Math.round(tax),
      country: 'co', 
      lang: 'en',
      

      name_billing: user?.displayName || '',
      email_billing: user?.email || '',
      

      response: `${window.location.origin}/payment-response?orderId=${order.orderId}`,
  
      extra1: order.orderId
    });
  };

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