import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-8 mb-4">
            <Link href="#" className="text-xs text-neutral-500 hover:text-neutral-700">Privacy</Link>
            <Link href="#" className="text-xs text-neutral-500 hover:text-neutral-700">Terms</Link>
            <Link href="#" className="text-xs text-neutral-500 hover:text-neutral-700">Help</Link>
          </div>
          <p className="text-xs text-neutral-400 text-center">
            &copy; {new Date().getFullYear()} Cultivate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
