import React from "react";

export default function About() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Learn more about our mission and values that guide our work.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Be Better. Pursue Better. Excellence as the standard.
          </h2>
          <p className="mt-2 text-xl text-primary-600 font-semibold">
            Establish Permanent Legacy
          </p>
          <p className="mt-6 text-lg text-gray-500">
            Capture, analyze, and enhance family Sessions. Get personalized insights to strengthen your parent-child relationships.
          </p>
          
          <div className="mt-12">
            <div className="bg-white shadow-lg rounded-lg px-8 py-10 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                We believe that meaningful communication forms the foundation of strong family bonds. Our mission is to empower parents with insights and tools to nurture more effective, empathetic, and impactful conversations with their children.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 mb-6">
                We envision a world where every parent has access to personalized guidance that helps them develop deeper connections with their children through conversation. By analyzing and enhancing family discussions, we aim to positively impact the next generation.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Privacy-First Approach</h4>
                  <p className="text-gray-600 text-sm">
                    We prioritize your family's privacy and ensure all data is securely handled and protected.
                  </p>
                </div>
                <div className="border border-gray-100 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Evidence-Based Insights</h4>
                  <p className="text-gray-600 text-sm">
                    Our analysis and recommendations are grounded in research and developmental psychology.
                  </p>
                </div>
                <div className="border border-gray-100 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Inclusive Support</h4>
                  <p className="text-gray-600 text-sm">
                    We recognize and respect diverse parenting styles and family structures.
                  </p>
                </div>
                <div className="border border-gray-100 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Continuous Improvement</h4>
                  <p className="text-gray-600 text-sm">
                    We strive to constantly refine our tools and insights to better serve families.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Benefits of Learning from Your Interactions</h3>
                <ul className="text-left space-y-4">
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Gain Objective Self-Awareness:</span> Review your own communication style, tone, and reactions in interactions with your children, helping you identify personal habits and areas for growth.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Understand Your Child's Perspective:</span> See conversations from a different angle, helping you better grasp how your child communicates, perceives situations, and reacts.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Improve Communication Clarity:</span> Identify moments of misunderstanding or miscommunication more easily, allowing for clearer future interactions.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Identify Recurring Patterns:</span> Recognize repeated dynamics or communication challenges within family interactions, enabling more targeted efforts for improvement.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Learn from Difficult Moments:</span> Reflect on challenging conversations or disagreements more dispassionately to understand root causes and find more constructive approaches ("Pain + Reflection = Progress").
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Accelerate Learning and Growth:</span> Speed up the process of understanding family dynamics and improving your parenting communication skills through focused reflection.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Strengthen Family Bonds:</span> Use the insights gained to foster more empathetic, understanding, and effective communication, leading to stronger relationships.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="font-bold text-primary-700">•</div>
                    <div>
                      <span className="font-bold">Create a Factual Record for Reflection:</span> Move beyond subjective memories of conversations to review what was actually said and done, providing a more accurate basis for learning.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <blockquote className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 max-w-2xl mx-auto rounded-lg">
              <p className="text-lg text-amber-900 font-medium italic leading-relaxed">
                "Instead of buying your children all the things you never had, you should teach them all the things you were never taught."
              </p>
              <footer className="mt-3 text-sm text-amber-700 font-medium">— Bruce Lee</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}