import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-neutral-400 text-center order-2 sm:order-1 mt-2 sm:mt-0">
            &copy; {new Date().getFullYear()} Cultivate
          </p>
          <div className="flex space-x-6 order-1 sm:order-2">
            <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Privacy</Link>
            <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Terms</Link>
            <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
