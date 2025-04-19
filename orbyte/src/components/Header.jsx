

export default function Header() {
  return (
    <header className="main-header">
      <div className="logo">
        <img src="../public/logo/iso-white.png" alt="Logo" className="logo-img" />
      </div>
      <nav className="nav-menu">
        <ul>
          <li><a href="#about">ABOUT US</a></li>
          <li>SERVICES</li>
          <li><a href="">CONTACT</a></li>
        </ul>
      </nav>
    </header>
  );
}
