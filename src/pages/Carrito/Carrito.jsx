import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import Header from "../../components/Shared/Header"
import Footer from "../../components/Shared/Footer"
import { useCart } from "../../context/CartContext"
import styles from "./Carrito.module.scss"
import { useNavigate } from "react-router-dom"
import useDocumentTitle from "../../hooks/useDocumentTitle"

const Carrito = () => {
    useDocumentTitle("Carrito | proyecto EyA");
    const { state, updateQuantity, removeItem } = useCart()
    const { items } = state
    const navigate = useNavigate()
    const calculateSubtotal = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const shipping = items.length > 0 ? 9.99 : 0
    const tax = calculateSubtotal() * 0.1 // 10% tax rate
    const total = calculateSubtotal() + shipping + tax

    return (
        <>
        <Header />
        <div className={styles.cartcontainer}>
            <div className={styles.cartheader}>
            <span onClick={() => navigate("/store")} className={styles.continuelink}>
                ← Continue Shopping
            </span>
            <h1>Shopping Cart ({state.totalItems})</h1>
            </div>

            <div className={styles.cartcontent}>
            <div className={styles.cartitems}>
                {items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className={styles.cartitem}>
                    <div className={styles.itemimage}>
                        <img src={item.image || "/placeholder.svg"} alt={item.name} width={200} height={200} />
                    </div>
                    <div className={styles.itemdetails}>
                        <div className={styles.itemheader}>
                        <h3>{item.name}</h3>
                        <button className={styles.removebutton} onClick={() => removeItem(item.id)}>
                            <Trash2 size={18} />
                        </button>
                        </div>
                        <p className={styles.itemdescription}>{item.description}</p>
                        <div className={styles.itemactions}>
                        <div className={styles.quantitycontrol}>
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className={styles.icon} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className={styles.icon} />
                            </button>
                        </div>
                        <p className={styles.itemprice}>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    </div>
                ))
                ) : (
                <div className={styles.emptycart}>
                    <div className={styles.emptycarticon}>
                    <ShoppingCart size={64} />
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any products to your cart yet.</p>
                    <span onClick={() => navigate("/store")} className={styles.continueshoppingbutton}>
                    Start Shopping
                    </span>
                </div>
                )}
            </div>

            <div className={styles.ordersummary}>
                <h2>Order Summary</h2>
                <div className={styles.summaryrow}>
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className={styles.summaryrow}>
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
                </div>
                <div className={styles.summaryrow}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.summaryrow}>
                <span className={styles.totallabel}>Total</span>
                <span className={styles.totalamount}>${total.toFixed(2)}</span>
                </div>
                <button className={styles.checkoutbutton} disabled={items.length === 0}>
                Proceed to Checkout
                </button>
                <p className={styles.shippingnote}>Free shipping on orders over $100. 30-day money-back guarantee.</p>
            </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Carrito
