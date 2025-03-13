import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGear, faPen, faHeart, faShoppingCart, faDoorOpen, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../asset/css/home.css';
import BackgroundSlideshow from "./slide";
import { Link as ScrollLink } from "react-scroll";
import React, { useContext, useState, useEffect } from "react";

const Home = () => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);


    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Stored user:', storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleClick = () => {
    navigate('/getcode');
  };

  if (loading) {
    return (
      <svg viewBox="0 0 100 100" className="loader">
        <g className="points">
          <circle fill="#fff" r="50" cy="50" cx="50" className="ciw"></circle>
          <circle r="4" cy="50" cx="5" className="ci2"></circle>
          <circle r="4" cy="50" cx="95" className="ci1"></circle>
        </g>
      </svg>
    );
  }
  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.reload();
  };
  return (
    <>
      <nav className="navbar">
        <ul className="nav-links">
          <li><ScrollLink to="section-1" smooth={true} duration={500}>Home</ScrollLink></li>
          <li><ScrollLink to="section-2" smooth={true} duration={500}>News</ScrollLink></li>
          <li><ScrollLink to="section-3" smooth={true} duration={500}>Delivery</ScrollLink></li>
          <li><ScrollLink to="section-4" smooth={true} duration={500}>Contact</ScrollLink></li>
          <li><Link to="/product">Shop</Link></li>

          {user ? (
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
          ) : (
            <li><Link to="/login">Sign in</Link></li>
          )}
        </ul>
      </nav>


      <div className={"home-container"  }>
        <section id="section-1" className="section-1">
          <div className="container">
            <h1>Modern Online Clothing Store</h1>
            <p>A modern online clothing store is a digital platform where customers can browse, select, and purchase apparel from the comfort of their homes. These stores utilize cutting-edge web technologies, stylish UI/UX designs, and seamless e-commerce functionalities to enhance the shopping experience.</p>

            <p>By combining aesthetic design, advanced technology, and efficient logistics, a modern online clothing store delivers a seamless and enjoyable shopping experience for fashion enthusiasts worldwide.</p>
            <button className="disc-btn" onClick={handleClick}>
              <span className="disc-span">Discount</span>
            </button>
          </div>

        </section>

        <section id="section-2" className="section-2">
          <BackgroundSlideshow />
        </section>

        <section id="section-3" className="section-3">
          <div className="container3">
            <p class="cursor typewriter-animation">About Delivery</p>
            <p className='des-delivery'>A delivery service for an online clothing store is a critical component of the shopping experience, ensuring that customers receive their purchases in a timely and reliable manner. Once an order is placed, the store's system processes the payment and confirms the availability of items in stock. The clothes are then carefully packed, usually with protective materials to avoid any damage during transit.</p>
            <p className='des-delivery'>The store partners with trusted delivery carriers such as FedEx, UPS, or local couriers, depending on the destination. Delivery methods vary, offering options like standard, expedited, or express shipping for different customer needs. Some stores also provide same-day or next-day delivery for local orders, allowing customers to get their clothing as quickly as possible. Additionally, tracking numbers are provided to allow customers to monitor the progress of their shipment, ensuring peace of mind throughout the process.
            </p>

          </div>
        </section>

        <section id="section-4" className="section-4">
          <div className="container4">
            <div class="masking-container">
              <h1 class="masked-text">Contact Us.</h1>
            </div>
            <p className="discription">If you have any questions or need further information, please feel free to reach out to us. We are happy to assist you! You can contact us through the following methods:</p>
            <div class="input-wrapper">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g data-name="Layer 2">
                  <g data-name="inbox">
                    <rect
                      width="24"
                      height="24"
                      transform="rotate(180 12 12)"
                      opacity="0"
                    ></rect>
                    <path
                      d="M20.79 11.34l-3.34-6.68A3 3 0 0 0 14.76 3H9.24a3 3 0 0 0-2.69 1.66l-3.34 6.68a2 2 0 0 0-.21.9V18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5.76a2 2 0 0 0-.21-.9zM8.34 5.55a1 1 0 0 1 .9-.55h5.52a1 1 0 0 1 .9.55L18.38 11H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1H5.62z"
                    ></path>
                  </g>
                </g>
              </svg>
              <input type="text" name="text" class="input" placeholder="info@gmail.com" />
              <button class="Subscribe-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="10"
                  viewBox="0 0 38 15"
                  class="arrow"
                >
                  <path
                    d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
                  ></path></svg
                >Subscribe
              </button>
            </div>

          </div>
          <footer  className="footerx">
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
        </section>
      </div>

    </>
  );
};

export default Home;
