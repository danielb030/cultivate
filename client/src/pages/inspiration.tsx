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
                While initially daunting, the impact was undeniable. Hearing ourselves objectively, combined with direct feedback, led to dramatic improvements in performance after just a few sessions. It highlighted how reviewing actual interactions, rather than relying on memory or subjective impressions, is a potent catalyst for rapid learning and growth. This experience planted the seed for an application that could bring that same power of recorded reflection and focused critique into other crucial areas of communication, like family life.
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">How We Generated Significant Revenue</h3>
              <p className="text-gray-700 mb-4">
                This methodical approach to communication wasn't just educational—it delivered real results. We received purchase orders for our ERP software and services by talking to prospects over the phone only, without in-person meetings. This generated significant revenue for our company by mastering the art of effective communication.
              </p>
              
              <div className="bg-amber-50 p-5 rounded-lg mt-3 mb-5">
                <h4 className="font-bold text-gray-800 mb-2">Our Structured Process Included:</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>A specific list of questions that guided conversations strategically</li>
                  <li>Listening for certain responses, tone changes, or objections to overcome</li>
                  <li>Learning to ask open-ended questions (avoiding yes/no responses)</li>
                  <li>Understanding the power of a pause in speaking—creating space for the other person to reflect and respond</li>
                  <li>Techniques for identifying buying signals and objection patterns</li>
                </ul>
              </div>
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
                Just as these principles revolutionize organizational effectiveness, we believe they can transform family dynamics. The same techniques that generate revenue in business can strengthen relationships at home:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border border-primary-100 bg-primary-50 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">From Strategic Questions to Meaningful Conversations</h4>
                  <p className="text-gray-600 text-sm">
                    Just as we used tailored questions in sales, parents can develop questions that encourage children to open up and share their thoughts and feelings more deeply.
                  </p>
                </div>
                <div className="border border-primary-100 bg-primary-50 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">From Reading Tone to Emotional Intelligence</h4>
                  <p className="text-gray-600 text-sm">
                    Recognizing tone changes and emotional cues in your children helps you respond to their underlying needs, just as we identified buying signals in prospects.
                  </p>
                </div>
                <div className="border border-primary-100 bg-primary-50 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">From Open-Ended Questions to Deeper Connection</h4>
                  <p className="text-gray-600 text-sm">
                    Open-ended questions that invite exploration rather than yes/no answers create space for genuine expression and discovery in family conversations.
                  </p>
                </div>
                <div className="border border-primary-100 bg-primary-50 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">From Strategic Pauses to Active Listening</h4>
                  <p className="text-gray-600 text-sm">
                    The power of a pause—giving your child time to think and express themselves—demonstrates respect and creates space for authentic communication.
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700">
                Cultivate was built to make this powerful learning process accessible, private, and tailored to the unique challenges of parent-child communication. By bringing the same level of intentional reflection to our most important relationships, we can accelerate growth as parents and deepen our connections with our children.
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