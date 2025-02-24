export default function DashFooter() {
  return (
    <footer className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 z-30">
      <div className="h-16 flex items-center justify-between px-6">
        <div>
          <p className="text-sm text-gray-600">
            © 2024 SurveyPay. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href="/privacy"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
