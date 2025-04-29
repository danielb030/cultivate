import React from "react";

export default function Inspiration() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Our Inspiration</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              The story behind why we created Cultivate
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg px-8 py-10 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Origin Story</h2>
            <div className="prose prose-primary">
              <p className="text-gray-700 mb-4">
                The core concept for this app stems from a powerful lesson learned decades ago in my first sales role. Our VP of Sales implemented a challenging but effective training method: new salespeople had to record their sales calls. We then brought those tapes into group meetings where our calls were played back and critiqued openly by our peers and the VP.
              </p>
              <p className="text-gray-700 mb-4">
                While initially daunting, the impact was undeniable. Hearing ourselves objectively, combined with direct feedback, led to dramatic improvements in performance after just a few sessions. It highlighted how reviewing actual interactions, rather than relying on memory or subjective impressions, is a potent catalyst for rapid learning and growth.
              </p>
              
              <p className="text-gray-700 mb-4">
                The low-hanging fruit in this process was simply listening to ourselves. Most people are shocked when they first hear their own voice played back — not just the unfamiliar sound, but the patterns, filler words, and implicit assumptions that become obvious when listening as an observer. This objective perspective alone created immediate opportunities for improvement that would otherwise remain invisible.
              </p>
              
              <p className="text-gray-700 mb-4">
                What made this approach particularly effective was our focus on the nuances of verbal communication: tone shifts, vocal inflection, volume changes, and speech cadence. By analyzing these elements together, we quickly identified when enthusiasm was lacking, when nervousness crept in, or when we were talking too fast for listeners to absorb information. These subtle cues — often imperceptible to the speaker in the moment — had profound effects on how our messages were received and interpreted.
              </p>
              
              <p className="text-gray-700 mb-4">
                This experience planted the seed for an application that could bring that same power of recorded reflection and focused critique into other crucial areas of communication, like family life.
              </p>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Bridgewater Approach</h3>
              <p className="text-gray-700 mb-4">
                Our approach is also inspired by Ray Dalio's Bridgewater Associates, where recording meetings has become a cornerstone practice that aligns with their core principles:
              </p>
              
              <div className="bg-slate-50 p-5 rounded-lg mt-5">
                <h4 className="font-bold text-gray-800 mb-2">Fostering Radical Truth and Honesty</h4>
                <p className="text-gray-600 text-sm mb-4">
                  The knowledge that conversations are recorded eliminates "spin" and encourages direct, honest communication. This enforced directness surfaces genuine opinions and fosters "real honesty."
                </p>
                
                <h4 className="font-bold text-gray-800 mb-2">Supporting the Idea Meritocracy</h4>
                <p className="text-gray-600 text-sm mb-4">
                  By capturing discussions verbatim, recordings allow contributions to be evaluated objectively, based on demonstrable merit rather than hierarchy or politics.
                </p>
                
                <h4 className="font-bold text-gray-800 mb-2">Enhancing Learning and Improvement</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Recordings serve as an objective resource for learning and continuous improvement, embodying the principle "Pain + Reflection = Progress." They allow individuals to review past interactions, identify weaknesses dispassionately, and learn from them.
                </p>
                
                <h4 className="font-bold text-gray-800 mb-2">Accountability and Maintaining Standards</h4>
                <p className="text-gray-600 text-sm">
                  The existence of an undeniable record promotes personal accountability. Recordings make it clear what was said and what decisions were made, reducing ambiguity and ensuring that commitments are followed through.
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Applying This to Family Life</h3>
              <p className="text-gray-700 mb-4">
                Just as these principles revolutionize organizational effectiveness, we believe they can transform family dynamics. By bringing the same level of intentional reflection to our most important relationships, we can accelerate growth as parents and deepen our connections with our children.
              </p>
              <p className="text-gray-700">
                Cultivate was built to make this powerful learning process accessible, private, and tailored to the unique challenges of parent-child communication.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <blockquote className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 max-w-2xl mx-auto rounded-lg">
              <p className="text-lg text-amber-900 font-medium italic leading-relaxed">
                "Pain plus reflection equals progress."
              </p>
              <footer className="mt-3 text-sm text-amber-700 font-medium">— Ray Dalio</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}