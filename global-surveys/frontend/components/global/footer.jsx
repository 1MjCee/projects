export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto text-center">
        <p className="mb-4">© 2023 SurveyPay. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="/about" className="hover:text-blue-400">
            About Us
          </a>
          <a href="/privacy" className="hover:text-blue-400">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:text-blue-400">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
