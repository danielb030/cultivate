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
    { name: "Recordings", path: "/recordings" },
    { name: "Insights", path: "/insights" },
    { name: "Tips", path: "/tips" },
  ];

  return (
    <header className="bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <LogoWithText className="text-primary-600" size="sm" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`text-xs font-medium ${
                location === item.path ? "text-primary-600" : "text-neutral-500 hover:text-primary-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <button 
            onClick={() => setHelpDialogOpen(true)}
            className="text-xs font-medium text-neutral-500 hover:text-primary-600"
            aria-label="Help"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </nav>
        
        <button
          type="button"
          className="md:hidden p-1 rounded-md text-neutral-500 hover:text-neutral-600 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-50 py-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col space-y-0.5">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className={`px-3 py-1.5 text-xs font-medium ${
                  location === item.path 
                    ? "text-primary-600" 
                    : "text-neutral-500 hover:text-primary-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              className="px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-primary-600 flex items-center"
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpDialogOpen(true);
              }}
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
              Help
            </button>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cultivate: Establish Permanent Legacy</DialogTitle>
            <DialogDescription>
              Be Better. Pursue Better. Excellence as the standard. Establish Permanent Legacy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm">Improving Your Parenting</h3>
              <p className="text-sm text-gray-500">
                Just like businesses record calls "for training purposes," record your family interactions 
                to gain deeper insights into how you communicate with your children.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Multiple Media Options</h3>
              <p className="text-sm text-gray-500">
                Upload audio, video, or written transcripts of family interactions. Capture moments like 
                handling conflicts, important conversations, or daily routines.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Real-World Example</h3>
              <p className="text-sm text-gray-500">
                A father who recorded a difficult interaction about screen time gained insight into his approach
                after reviewing the conversation, helping him improve future interactions.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Growth Mindset</h3>
              <p className="text-sm text-gray-500">
                "Fool me once, shame on you. Fool me twice, shame on me." Learn from each interaction
                to continuously improve your parenting skills and establish a permanent legacy.
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
