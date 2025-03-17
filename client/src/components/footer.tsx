import { PlusCircle, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <PlusCircle className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-primary-600">Cultivate</span>
            </div>
            <p className="text-neutral-500 text-base">
              Helping parents build stronger connections and foster exceptional futures for their children.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
                  Solutions
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      For Parents
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      For Educators
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      For Families
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Guides
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      API Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Press
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-base text-neutral-400 xl:text-center">
            &copy; {new Date().getFullYear()} Cultivate, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
