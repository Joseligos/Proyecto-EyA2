import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Search, ChevronDown, ChevronRight } from 'lucide-react'
import Header from "../../components/Shared/Header"
import Footer from "../../components/Shared/Footer"
import { useCart } from "../../context/CartContext"
import styles from "./Tienda.module.scss"
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Tienda = () => {
    useDocumentTitle("Tienda | proyecto EyA");
    const navigate = useNavigate();
    const { state, addItem } = useCart();
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    
    const categoryTree = [
        { 
            id: "programs", 
            name: "Fitness Programs",
            subcategories: [
                { id: "programs-strength", name: "Strength Training" },
                { id: "programs-cardio", name: "Cardio & HIIT" },
                { id: "programs-flexibility", name: "Flexibility & Yoga" },
                { id: "programs-specialized", name: "Specialized Programs" }
            ]
        },
        { 
            id: "equipment", 
            name: "Equipment",
            subcategories: [
                { id: "equipment-weights", name: "Weights & Resistance" },
                { id: "equipment-cardio", name: "Cardio Equipment" },
                { id: "equipment-accessories", name: "Accessories" },
                { id: "equipment-tech", name: "Fitness Tech" }
            ]
        },
        { 
            id: "nutrition", 
            name: "Nutrition",
            subcategories: [
                { id: "nutrition-protein", name: "Protein" },
                { id: "nutrition-supplements", name: "Supplements" },
                { id: "nutrition-vitamins", name: "Vitamins & Minerals" },
                { id: "nutrition-snacks", name: "Healthy Snacks" }
            ]
        },
        { 
            id: "apparel", 
            name: "Apparel",
            subcategories: [
                { id: "apparel-men", name: "Men's Clothing" },
                { id: "apparel-women", name: "Women's Clothing" },
                { id: "apparel-shoes", name: "Footwear" },
                { id: "apparel-accessories", name: "Accessories" }
            ]
        },
    ];

    // Expanded product list with subcategories
    const products = [
        // Strength Training Programs
        {
            id: 1,
            name: "12-Week Strength Program",
            description: "Complete strength training program for all fitness levels",
            price: 399000, 
            category: "programs",
            subcategory: "programs-strength",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 2,
            name: "Powerlifting Fundamentals",
            description: "Master the squat, bench press, and deadlift with expert coaching",
            price: 450000,
            category: "programs",
            subcategory: "programs-strength",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Cardio & HIIT Programs
        {
            id: 3,
            name: "HIIT Cardio Program",
            description: "8-week high intensity interval training program",
            price: 320000, 
            category: "programs",
            subcategory: "programs-cardio",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 4,
            name: "30-Day Fat Burn Challenge",
            description: "Intensive cardio program designed for maximum calorie burn",
            price: 280000,
            category: "programs",
            subcategory: "programs-cardio",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Flexibility Programs
        {
            id: 5,
            name: "Yoga for Athletes",
            description: "Improve flexibility and recovery with this specialized yoga program",
            price: 250000,
            category: "programs",
            subcategory: "programs-flexibility",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 6,
            name: "Mobility Mastery",
            description: "Comprehensive program to improve joint mobility and flexibility",
            price: 290000,
            category: "programs",
            subcategory: "programs-flexibility",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Specialized Programs
        {
            id: 7,
            name: "Post-Pregnancy Fitness",
            description: "Safe and effective workouts for new mothers",
            price: 350000,
            category: "programs",
            subcategory: "programs-specialized",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 8,
            name: "Senior Strength & Balance",
            description: "Specialized program for maintaining strength and mobility as you age",
            price: 320000,
            category: "programs",
            subcategory: "programs-specialized",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Weights & Resistance Equipment
        {
            id: 9,
            name: "Adjustable Dumbbells",
            description: "Space-saving adjustable weight dumbbells",
            price: 800000, 
            category: "equipment",
            subcategory: "equipment-weights",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 10,
            name: "Resistance Bands Set",
            description: "5-piece resistance bands for home workouts",
            price: 120000, 
            category: "equipment",
            subcategory: "equipment-weights",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 11,
            name: "Olympic Barbell",
            description: "Professional-grade 20kg Olympic barbell",
            price: 650000,
            category: "equipment",
            subcategory: "equipment-weights",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Cardio Equipment
        {
            id: 12,
            name: "Foldable Treadmill",
            description: "Space-saving treadmill with 12 preset programs",
            price: 1800000,
            category: "equipment",
            subcategory: "equipment-cardio",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 13,
            name: "Indoor Cycling Bike",
            description: "Professional indoor cycling bike with magnetic resistance",
            price: 1200000,
            category: "equipment",
            subcategory: "equipment-cardio",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Accessories Equipment
        {
            id: 14,
            name: "Yoga Mat Premium",
            description: "Extra thick, non-slip yoga mat for comfort and stability",
            price: 90000,
            category: "equipment",
            subcategory: "equipment-accessories",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 15,
            name: "Foam Roller",
            description: "High-density foam roller for muscle recovery",
            price: 70000,
            category: "equipment",
            subcategory: "equipment-accessories",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Fitness Tech
        {
            id: 16,
            name: "Performance Fitness Tracker",
            description: "Track your workouts, heart rate, and progress",
            price: 520000, 
            category: "equipment",
            subcategory: "equipment-tech",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 17,
            name: "Smart Body Composition Scale",
            description: "Measures weight, body fat, muscle mass, and more",
            price: 180000,
            category: "equipment",
            subcategory: "equipment-tech",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Protein Nutrition
        {
            id: 18,
            name: "Premium Whey Protein",
            description: "2kg container of high-quality whey protein",
            price: 200000,
            category: "nutrition",
            subcategory: "nutrition-protein",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 19,
            name: "Plant-Based Protein",
            description: "Complete plant-based protein powder, 1kg",
            price: 180000,
            category: "nutrition",
            subcategory: "nutrition-protein",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Supplements
        {
            id: 20,
            name: "Pre-Workout Supplement",
            description: "Energy-boosting pre-workout formula",
            price: 100000, 
            category: "nutrition",
            subcategory: "nutrition-supplements",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 21,
            name: "BCAA Recovery Formula",
            description: "Branched-chain amino acids for muscle recovery",
            price: 120000,
            category: "nutrition",
            subcategory: "nutrition-supplements",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Vitamins & Minerals
        {
            id: 22,
            name: "Multivitamin for Athletes",
            description: "Complete vitamin and mineral formula for active individuals",
            price: 85000,
            category: "nutrition",
            subcategory: "nutrition-vitamins",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 23,
            name: "Vitamin D3 + K2",
            description: "Essential vitamins for bone health and immune support",
            price: 65000,
            category: "nutrition",
            subcategory: "nutrition-vitamins",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Healthy Snacks
        {
            id: 24,
            name: "Protein Bars (12 Pack)",
            description: "High-protein, low-sugar bars for on-the-go nutrition",
            price: 75000,
            category: "nutrition",
            subcategory: "nutrition-snacks",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 25,
            name: "Organic Trail Mix",
            description: "Nutrient-dense mix of nuts, seeds, and dried fruits",
            price: 45000,
            category: "nutrition",
            subcategory: "nutrition-snacks",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Men's Clothing
        {
            id: 26,
            name: "Men's Performance T-Shirt",
            description: "Moisture-wicking fabric for intense workouts",
            price: 90000,
            category: "apparel",
            subcategory: "apparel-men",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 27,
            name: "Men's Training Shorts",
            description: "Lightweight, breathable shorts with built-in liner",
            price: 110000,
            category: "apparel",
            subcategory: "apparel-men",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Women's Clothing
        {
            id: 28,
            name: "Women's Sports Bra",
            description: "High-support sports bra for intense activities",
            price: 95000,
            category: "apparel",
            subcategory: "apparel-women",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 29,
            name: "Compression Fitness Shirt",
            description: "Moisture-wicking compression shirt for workouts",
            price: 140000, 
            category: "apparel",
            subcategory: "apparel-women",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Footwear
        {
            id: 30,
            name: "Cross-Training Shoes",
            description: "Versatile shoes for various workout types",
            price: 280000,
            category: "apparel",
            subcategory: "apparel-shoes",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 31,
            name: "Running Shoes",
            description: "Lightweight, cushioned shoes for road running",
            price: 320000,
            category: "apparel",
            subcategory: "apparel-shoes",
            image: "/placeholder.svg?height=300&width=300",
        },
        
        // Apparel Accessories
        {
            id: 32,
            name: "Workout Gloves",
            description: "Padded gloves for weightlifting and cross-training",
            price: 60000,
            category: "apparel",
            subcategory: "apparel-accessories",
            image: "/placeholder.svg?height=300&width=300",
        },
        {
            id: 33,
            name: "Sports Water Bottle",
            description: "BPA-free 750ml bottle with time markers",
            price: 40000,
            category: "apparel",
            subcategory: "apparel-accessories",
            image: "/placeholder.svg?height=300&width=300",
        },
    ];

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        setActiveSubcategory(null);
    };

    const handleSubcategoryClick = (subcategoryId) => {
        setActiveSubcategory(subcategoryId);
    };

    const filteredProducts = products.filter(product => {
        const categoryMatch = 
            activeCategory === "all" || 
            product.category === activeCategory;
        
        const subcategoryMatch = 
            !activeSubcategory || 
            product.subcategory === activeSubcategory;
        
        const searchMatch = 
            searchQuery === "" || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return categoryMatch && subcategoryMatch && searchMatch;
    });

    const handleAddToCart = (product) => {
        addItem({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
        });
    };

    const formatPrice = (price) => {
        return `$${price.toLocaleString('es-CO')}`;
    };

    const resetFilters = () => {
        setActiveCategory("all");
        setActiveSubcategory(null);
        setSearchQuery("");
    };

    return (
        <>
        <Header />
        <div className={styles.storecontainer}>
            <div className={styles.storeheader}>
                <h1>Fitness Store</h1>
                <div className={styles.carticon}>
                    <div className={styles.carticonwrapper} onClick={() => navigate("/cart")}>
                        <ShoppingCart size={24} />
                        <span className={styles.cartcount}>{state.totalItems}</span>
                    </div>
                </div>
            </div>

            <div className={styles.storelayout}>
                <div className={styles.sidebar}>
                    <h2>Categories</h2>
                    <ul className={styles.categorytree}>
                        <li 
                            className={`${styles.categoryitem} ${activeCategory === "all" ? styles.active : ""}`}
                            onClick={() => resetFilters()}
                        >
                            All Products
                        </li>
                        
                        {categoryTree.map((category) => (
                            <li key={category.id} className={styles.categoryitem}>
                                <div 
                                    className={`${styles.categoryheader} ${activeCategory === category.id && !activeSubcategory ? styles.active : ""}`}
                                    onClick={() => {
                                        toggleCategory(category.id);
                                        handleCategoryClick(category.id);
                                    }}
                                >
                                    {expandedCategories[category.id] ? 
                                        <ChevronDown size={16} /> : 
                                        <ChevronRight size={16} />
                                    }
                                    <span>{category.name}</span>
                                </div>
                                
                                {expandedCategories[category.id] && (
                                    <ul className={styles.subcategorylist}>
                                        {category.subcategories.map((subcategory) => (
                                            <li 
                                                key={subcategory.id}
                                                className={`${styles.subcategoryitem} ${activeSubcategory === subcategory.id ? styles.active : ""}`}
                                                onClick={() => {
                                                    handleCategoryClick(category.id);
                                                    handleSubcategoryClick(subcategory.id);
                                                }}
                                            >
                                                {subcategory.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.maincontent}>
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
                    </div>

                    <div className={styles.activefilters}>
                        {activeCategory !== "all" && (
                            <div className={styles.filterchip}>
                                {categoryTree.find(c => c.id === activeCategory)?.name}
                                <button onClick={() => setActiveCategory("all")}>×</button>
                            </div>
                        )}
                        
                        {activeSubcategory && (
                            <div className={styles.filterchip}>
                                {categoryTree
                                    .find(c => c.id === activeCategory)
                                    ?.subcategories.find(s => s.id === activeSubcategory)?.name}
                                <button onClick={() => setActiveSubcategory(null)}>×</button>
                            </div>
                        )}
                        
                        {(activeCategory !== "all" || activeSubcategory || searchQuery) && (
                            <button 
                                className={styles.clearfilters}
                                onClick={resetFilters}
                            >
                                Clear All Filters
                            </button>
                        )}
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
                                            <span className={styles.productprice}>{formatPrice(product.price)}</span>
                                            <button 
                                                className={styles.addtocartbutton} 
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noproducts}>
                                <p>No products found. Try a different search or category.</p>
                                <button 
                                    className={styles.resetbutton}
                                    onClick={resetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.featuredsection}>
                <div className={styles.featuredcard}>
                    <div className={styles.featuredcontent}>
                        <h2>New Arrivals</h2>
                        <p>Check out our latest fitness equipment and programs</p>
                        <button 
                            className={styles.featuredbutton} 
                            onClick={() => resetFilters()}
                        >
                            Shop Now
                        </button>
                    </div>
                    <div className={styles.featuredimage}>
                        <img 
                            src="/placeholder.svg?height=400&width=400" 
                            alt="New Arrivals" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Tienda;