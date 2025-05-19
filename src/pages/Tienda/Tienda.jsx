import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Filter, Search } from "lucide-react"
import Header from "../../components/Shared/Header"
import Footer from "../../components/Shared/Footer"
import { useCart } from "../../context/CartContext"
import styles from "./Tienda.module.scss"
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { Link } from "react-router-dom"

const Tienda = () => {
    useDocumentTitle("Tienda | proyecto EyA");
    const navigate = useNavigate()
    const { state, addItem } = useCart()
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const categories = [
        { id: "all", name: "All Products" },
        { id: "programs", name: "Fitness Programs" },
        { id: "equipment", name: "Equipment" },
        { id: "nutrition", name: "Nutrition" },
        { id: "apparel", name: "Apparel" },
    ]

    const products = [
        {
        id: 1,
        name: "12-Week Strength Program",
        description: "Complete strength training program for all fitness levels",
        price: 99.99,
        category: "programs",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 2,
        name: "Resistance Bands Set",
        description: "5-piece resistance bands for home workouts",
        price: 29.99,
        category: "equipment",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 3,
        name: "Premium Whey Protein",
        description: "2kg container of high-quality whey protein",
        price: 49.99,
        category: "nutrition",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 4,
        name: "Performance Fitness Tracker",
        description: "Track your workouts, heart rate, and progress",
        price: 129.99,
        category: "equipment",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 5,
        name: "HIIT Cardio Program",
        description: "8-week high intensity interval training program",
        price: 79.99,
        category: "programs",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 6,
        name: "Compression Fitness Shirt",
        description: "Moisture-wicking compression shirt for workouts",
        price: 34.99,
        category: "apparel",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 7,
        name: "Pre-Workout Supplement",
        description: "Energy-boosting pre-workout formula",
        price: 39.99,
        category: "nutrition",
        image: "/placeholder.svg?height=300&width=300",
        },
        {
        id: 8,
        name: "Adjustable Dumbbells",
        description: "Space-saving adjustable weight dumbbells",
        price: 199.99,
        category: "equipment",
        image: "/placeholder.svg?height=300&width=300",
        },
    ]

    // Filter products by category and search query
    const filteredProducts = products
        .filter((product) => activeCategory === "all" || product.category === activeCategory)
        .filter(
        (product) =>
            searchQuery === "" ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )

    const handleAddToCart = (product) => {
        addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        })
    }

    return (
        <>
        <Header />
        <div className={styles.storecontainer}>
            <div className={styles.storeheader}>
            <h1>Fitness Store</h1>
            <div className={styles.carticon}>
                <div className={styles.carticonwrapper}>
                    <ShoppingCart size={24} onClick={() => navigate("/cart")}/>
                    <span className={styles.cartcount}>{state.totalItems}</span>
                </div>
            </div>
            </div>

            <div className={styles.searchbar}>
            <div className={styles.searchinputwrapper}>
                <Search size={20} className={styles.searchicon} />
                <input
                type="text"
                placeholder="Search products..."
                className={styles.searchinput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button className={styles.filterbutton}>
                <Filter size={20} />
                <span>Filter</span>
            </button>
            </div>

            <div className={styles.categories}>
            {categories.map((category) => (
                <button
                key={category.id}
                className={`styles.categorybutton ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
                >
                {category.name}
                </button>
            ))}
            </div>

            <div className={styles.productsgrid}>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                <div key={product.id} className={styles.productcard}>
                    <div className={styles.productimage}>
                    <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    </div>
                    <div className={styles.productdetails}>
                    <h3>{product.name}</h3>
                    <p className={styles.productdescription}>{product.description}</p>
                    <div className={styles.productfooter}>
                        <span className={styles.productprice}>${product.price.toFixed(2)}</span>
                        <button className={styles.addtocartbutton} onClick={() => handleAddToCart(product)}>
                        Add to Cart
                        </button>
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <div className={styles.noproducts}>
                <p>No products found. Try a different search or category.</p>
                </div>
            )}
            </div>

            <div className={styles.featuredsection}>
            <div className={styles.featuredcard}>
                <div className={styles.featuredcontent}>
                <h2>New Arrivals</h2>
                <p>Check out our latest fitness equipment and programs</p>
                <button className={styles.featuredbutton} onClick={() => setActiveCategory("all")}>
                    Shop Now
                </button>
                </div>
                <div className={styles.featuredimage}>
                <img src="/placeholder.svg?height=400&width=400" alt="New Arrivals" width={400} height={400} />
                </div>
            </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Tienda
