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
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex flex-col items-start">
            <LogoWithText className="text-primary-600" />
            <span className="text-xs text-neutral-500 ml-10 -mt-1">Be their Guide as well as their Guardian.</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`text-sm font-medium ${
                location === item.path ? "text-primary-600" : "text-neutral-600 hover:text-primary-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <button 
            onClick={() => setHelpDialogOpen(true)}
            className="text-sm font-medium text-neutral-600 hover:text-primary-600"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </nav>
        
        <button
          type="button"
          className="md:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-600 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className={`px-3 py-2 text-sm font-medium ${
                  location === item.path 
                    ? "text-primary-600" 
                    : "text-neutral-600 hover:text-primary-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600 flex items-center"
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpDialogOpen(true);
              }}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </button>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cultivate: Be their Guide as well as their Guardian.</DialogTitle>
            <DialogDescription>
              Improve your parenting by analyzing family interactions and gaining valuable insights.
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
