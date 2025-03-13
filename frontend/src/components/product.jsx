import React, { useState, useEffect } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from "../services/api";
import '../asset/css/product.css';
import { Link,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGear,faPen,faHeart, faShoppingCart,faDoorOpen,faUserShield } from "@fortawesome/free-solid-svg-icons";
function Product() {
  const base_url = "https://back-end-e-commerce-p0si.onrender.com"  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
    

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored user:', storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
    
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));

    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);
  const handleAddToWishlist = (product) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงใน Wishlist");
      return;
    }


    const wishlistKey = `wishlist_${storedUser.id}`;
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

    const existingIndex = existingWishlist.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {

        const updatedWishlist = existingWishlist.filter((item) => item.id !== product.id);
        setWishlist(updatedWishlist);
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
        toastr.warning("สินค้าถูกลบออกจาก Wishlist!");
    } else {

        const updatedWishlist = [...existingWishlist, product];
        setWishlist(updatedWishlist);
        localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
        toastr.success("เพิ่มสินค้าลงใน Wishlist แล้ว!");
    }
};

  
  

  const handleAddToCart = (product, size, quantity) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
  
    if (!storedUser) {
      alert('Please log in to add items to the cart');
      navigate('/login');
      return;
    }
  
    const cartItem = {
      ...product,
      size,
      quantity,
    };
  

    const userId = storedUser.id || storedUser.username;
    const existingCart = JSON.parse(localStorage.getItem(`${userId}_cart`)) || [];
  
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id && item.size === size
    );
  
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }
  

    localStorage.setItem(`${userId}_cart`, JSON.stringify(existingCart));
  
    toastr.success(`Item added ${product.productname} to cart!`, 'Success');
  };
  const handleScrollToProducts = () => {
    const productSection = document.getElementById("product-list");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.reload();
  };
  return (
    <>
    <div className="overflow">
    <nav className="navbar">
            <ul className="nav-linkss">
              <li><Link to="/" >Home</Link></li>
          <li><Link to="/product" >Shop</Link></li>
          {user ? (
            <>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/heart">Wishlist</Link></li>
              <li className="user-menu">
                <span onClick={toggleDropdown} className="dropdown-toggle">
                  {user.username} <FontAwesomeIcon icon={faUser} />
                </span>
                {isOpen && (
                  <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                    {user.role == "admin" && (
                      <li><Link to="/admin">Admin Panel<FontAwesomeIcon className='icon' icon={faUserShield} /></Link></li>
                    )}
                    <li><Link to="/editprofile">Edit<FontAwesomeIcon className='icon' icon={faPen} /></Link></li>
                    <li><Link to="/cart">Cart<FontAwesomeIcon className='icon' icon={faShoppingCart} /></Link></li>
                    <li><Link to="/heart">Wishlist<FontAwesomeIcon className='icon' icon={faHeart} /></Link></li>
                    <li>
                      <span onClick={handleLogout}>
                        Logout <FontAwesomeIcon className="icon" icon={faDoorOpen} />
                      </span>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <li><Link to="/login">Sign in</Link></li> 
          )}

        </ul>
      </nav>
      <div id='header' className='header'></div>
      <div className='head'>
        <div className='shop-now'>
          <button type="button" className="btn-shop" onClick={handleScrollToProducts}>
            <strong>SHOP NOW!</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>


        </div>
        <img className='banner' src="/asset/images/banner3.png" alt="" />
    </div>
    <div class="neon-container">
    <div id="product-list" className="neon-container">
  <h1 className="neon-text">PRODUCT LIST.</h1>
  </div>
      </div>
      <div className="input-containerx">
        <input
          type="text"
          name="text"
          className="inputx"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="iconx">
          <svg
            width="19px"
            height="19px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path opacity={1} d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path opacity={1} d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path opacity={1} d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div className="product-cards">
        {filteredProducts.map((product) => (
          <div className="card" key={product.id}>
            <div className="card-inner">
              <div className="card-front">
                <img
                  src={`${base_url}${product.imageurl}`}
                  className="product-image"
                  alt={product.productname}
                />
              </div>

              <div className="card-back">
                <p className='desc'>Details: {product.description}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const selectedSize = e.target.size.value;
                    const quantity = parseInt(e.target.quantity.value);
                    handleAddToCart(product, selectedSize, quantity);
                  }}
                >
                  <div className="mydict">
                    {JSON.parse(product.sizes).map((size, index) => (
                      <label key={index} className='label1'>
                        <input
                          type="radio"
                          name="size"
                          value={size.sizeName}
                          required
                          id={`size-${index}`}
                        />
                        <span className='span1'>{size.sizeName}</span>
                      </label>
                    ))}
                  </div>

                  <label>
                    <input className='qtyinput' type="number" name="quantity" min="1" defaultValue="1" required />
                  </label>
                  <br />
                  <button className="cart-btn" type="submit">
                    <span className="shadow"></span>
                    <span className="edge"></span>
                    <span className="front text">Add to Cart</span>
                  </button>

                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="wishlist-btn"
                    style={{
                      color: wishlist.some((item) => item.id === product.id)
                        ? "red"
                        : "gray",
                    }}
                  >
                    <FontAwesomeIcon icon={faHeart} />
              </button>
                </form>
              </div>
            </div>

            <div className="card-details">
              <h3 className="product-name">{product.productname}</h3>
              <p className="product-price">฿{product.unitprice.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='banner2'>
        <div className='head'>
          <img className='banner2' src="/asset/images/banner2.png" alt="" />
        </div>
      </div>
      <div className="sponsor">
      <div class="section-sp">
        <div class="section-titlex"> MAIN PARTNERS.</div>
        <div class="partners-container">
            <div class="partner">
                <img src="/asset/images/chang.png" alt="" style={{ width: "100px" }}/>
                <p>OFFICIAL BEER</p>
            </div>
            <div class="partner">
            <img src="/asset/images/Mercedes.png" alt="" style={{ width: "100px" }} />
                <p>OFFICIAL CAR</p>
            </div>
        </div>
    </div>

    <div class="section-sp">
        <div class="section-titlex">OFFICIAL PARTNERS</div>
        <div class="partners-container">
            <div class="partner">
                <img src="/asset/images/monster.png" alt="" style={{ width: "95px" }}/>
                <p>OFFICIAL ENERGY DRINK</p>
            </div>
            <div class="partner">
                <img src="/asset/images/alien.png" alt="" style={{ width: "160px" }}/>
                <p>OFFICIAL GAMING GEAR</p>
            </div>
            <div class="partner">
                <img src="/asset/images/Puma.png"  style={{ height: "97px" }}/>
                <p>OFFICIAL CLOTH</p>
            </div>
            <div class="partner">
                <img src="/asset/images/token.png" alt="Socios"style={{ height: "98px" }}/>
                <p>OFFICIAL FAN TOKEN</p>
            </div>
            <div class="partner">
                <img src="/asset/images/true.png" alt=""style={{ height: "98px" }}/>
                <p>OFFICIAL TELECOM</p>
            </div>
            <div class="partner">
                <img src="/asset/images/music.png" alt=""style={{ height: "98px" }}/>
                <p>OFFICIAL MUSIC LABEL</p>
            </div>
        </div>
    </div>
     
    <div class="section-sp">
        <div class="section-titlex">OFFICIAL SUPPLIERS</div>
        <div class="partners-container">
            <div class="partner">
                <img src="/asset/images/java.png" alt=""style={{ height: "90px", width:"100%"}}  />
                <p>OFFICIAL LOVER</p>
            </div>
            <div class="partner">
                <img src="/asset/images/air.png" alt=""style={{ height: "90px", width:"65%"}}/>
                <p>OFFICIAL SNEAKERS</p>
            </div>
            <div class="partner">
                <img src="/asset/images/las.png" alt="La Casa de las Carcasas"style={{ height: "90px", width:"100%"}}/>
                <p>OFFICIAL CASES</p>
            </div>
            <div class="partner">
                <img src="/asset/images/hyperX.png" alt=""style={{ height: "90px", width:"100%"}}/>
                <p>OFFICIAL GAMING CHAIR</p>
            </div>
        </div>
    </div>
    </div>
    <footer  className='F1'>
          <div class="footer-content">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
            <div class="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
          <div className="c">
            <a className="socialContainer containerOne" href="#">
              <svg viewBox="0 0 16 16" className="socialSvg instagramSvg">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </a>
            <a className="socialContainer containerTwo" href="#">
              <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" className="socialSvg twitterSvg">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </a>
            <a className="socialContainer containerThree" href="#">
              <svg viewBox="0 0 448 512" className="socialSvg linkdinSvg">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
              </svg>
            </a>
            <a className="socialContainer containerFour" href="#">
              <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" className="socialSvg whatsappSvg">
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
              </svg>
            </a>
          </div>
        </footer>
        </div>
    </>
  );
}

export default Product;
