import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { LogoWithText } from "./logo";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Recordings", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: "Tips", path: "/tips" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <a className="flex items-center">
                <LogoWithText className="text-primary-600" />
              </a>
            </Link>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path}>
              <a className={`text-base font-medium ${
                location === item.path ? "text-primary-600" : "text-neutral-700 hover:text-primary-600"
              }`}>
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center text-primary-600 bg-primary-50 hover:bg-primary-100"
            onClick={() => setHelpDialogOpen(true)}
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            Help
          </Button>
          
          <div className="relative flex-shrink-0 group">
            <button
              type="button"
              className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-neutral-100">
                <svg className="h-full w-full text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </button>
          </div>
          
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <a 
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    location === item.path 
                      ? "text-primary-600 bg-primary-50" 
                      : "text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </Link>
            ))}
            <Button
              variant="outline"
              className="mt-2 justify-start"
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpDialogOpen(true);
              }}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help
            </Button>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to use Cultivate</DialogTitle>
            <DialogDescription>
              Cultivate helps you improve your parenting through conversation analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm">Recording Conversations</h3>
              <p className="text-sm text-gray-500">
                Use the "Start Recording" button to capture conversations with your children. 
                Alternatively, upload pre-recorded audio files.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Getting Insights</h3>
              <p className="text-sm text-gray-500">
                After uploading, we'll transcribe and analyze your conversation to provide 
                helpful parenting tips and insights.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Privacy</h3>
              <p className="text-sm text-gray-500">
                Your recordings are securely stored and only accessible to you. We prioritize 
                the privacy and security of your family conversations.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setHelpDialogOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
