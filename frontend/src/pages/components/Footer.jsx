const Footer = () => (
  <footer className="bg-white text-gray-800 border-t mt-12">
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-sm">
      {/* BUY */}
      <div>
        <h4 className="font-semibold mb-2">Buy</h4>
        <ul className="space-y-1">
          <li>Registration</li>
          <li>Bidding & buying help</li>
          <li>Stores</li>
          <li>Gift Cards</li>
        </ul>
      </div>

      {/* SELL */}
      <div>
        <h4 className="font-semibold mb-2">Sell</h4>
        <ul className="space-y-1">
          <li>Start selling</li>
          <li>How to sell</li>
          <li>Business sellers</li>
          <li>Affiliates</li>
        </ul>
        <h4 className="font-semibold mt-4 mb-2">Tools & Apps</h4>
        <ul className="space-y-1">
          <li>Developers</li>
          <li>Security Center</li>
          <li>Site Map</li>
        </ul>
      </div>

      {/* COMPANIES & SOCIAL */}
      <div>
        <h4 className="font-semibold mb-2">Our Company</h4>
        <ul className="space-y-1">
          <li>Loja Angola</li>
          <li>Partners</li>
        </ul>
        <h4 className="font-semibold mt-4 mb-2">Stay connected</h4>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Facebook</span>
          <span className="text-gray-600">X (Twitter)</span>
        </div>
      </div>

      {/* ABOUT */}
      <div>
        <h4 className="font-semibold mb-2">About</h4>
        <ul className="space-y-1">
          <li>Company Info</li>
          <li>News</li>
          <li>Investors</li>
          <li>Careers</li>
          <li>Diversity & Inclusion</li>
        </ul>
      </div>

      {/* HELP */}
      <div>
        <h4 className="font-semibold mb-2">Help & Contact</h4>
        <ul className="space-y-1">
          <li>Support Center</li>
          <li>Contact Us</li>
          <li>Returns</li>
          <li>Money Back Guarantee</li>
        </ul>
        <h4 className="font-semibold mt-4 mb-2">Community</h4>
        <ul className="space-y-1">
          <li>Announcements</li>
          <li>Forum</li>
          <li>Business Podcast</li>
        </ul>
      </div>

      {/* LANGUAGE / REGION */}
      <div>
        <h4 className="font-semibold mb-2">Region</h4>
        <div className="flex items-center space-x-2 border p-2 rounded w-fit">
          <img src="https://flagcdn.com/us.svg" className="w-5 h-5" alt="Flag" />
          <span>Angola (AO)</span>
        </div>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 py-4 border-t">
      &copy; {new Date().getFullYear()} Loja Angola. All rights reserved.
    </div>
  </footer>
);

export default Footer;
