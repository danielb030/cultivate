import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Heart, Brain, Users, Target, Calendar, ArrowRight } from "lucide-react";

export default function Tips() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Parenting Tips & Resources</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover practical strategies to improve your parenting skills, foster meaningful 
              conversations, and build stronger connections with your children.
            </p>
          </div>
        </div>
      </div>

      {/* Tips content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="communication" className="w-full">
          <TabsList className="mb-8 justify-start">
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="emotional">Emotional Intelligence</TabsTrigger>
            <TabsTrigger value="development">Child Development</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="communication" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle>Active Listening</CardTitle>
                  <CardDescription>The foundation of effective communication</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Put away distractions like phones or tablets</li>
                    <li>• Make eye contact and use affirming body language</li>
                    <li>• Don't interrupt, even when you think you know what they'll say</li>
                    <li>• Ask clarifying questions: "What I'm hearing is..."</li>
                    <li>• Acknowledge their feelings: "That sounds frustrating"</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle>Open-Ended Questions</CardTitle>
                  <CardDescription>Encourage thoughtful responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Start with what, how, or why</li>
                    <li>• Instead of "Did you have a good day?" try "What was the best part of your day?"</li>
                    <li>• Ask "How did that make you feel?" rather than "Were you sad?"</li>
                    <li>• Use "Tell me more about..." to explore topics deeper</li>
                    <li>• Be comfortable with silence after asking</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle>I-Statements</CardTitle>
                  <CardDescription>Express feelings without blame</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Use the format: "I feel [emotion] when [situation] because [reason]"</li>
                    <li>• Instead of "You never listen to me" try "I feel frustrated when I'm interrupted because I don't feel heard"</li>
                    <li>• Avoid accusatory language that starts with "you always" or "you never"</li>
                    <li>• Take responsibility for your own feelings</li>
                    <li>• Model this language so children learn to use it too</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <CardTitle>Family Meetings</CardTitle>
                  <CardDescription>Create a regular forum for communication</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Schedule weekly meetings at a consistent time</li>
                    <li>• Create a simple agenda: celebrations, concerns, decisions, fun</li>
                    <li>• Let everyone take turns speaking without interruption</li>
                    <li>• For younger children, keep meetings short (15-20 minutes)</li>
                    <li>• End with something positive or a fun family activity</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle>Humor and Playfulness</CardTitle>
                  <CardDescription>Lighten tense moments and build connection</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Use appropriate humor to defuse tension</li>
                    <li>• Create silly family traditions or inside jokes</li>
                    <li>• Be willing to laugh at yourself to model humility</li>
                    <li>• Avoid sarcasm that might be misinterpreted by children</li>
                    <li>• Use playful communication for difficult topics</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <CardTitle>Conflict Resolution</CardTitle>
                  <CardDescription>Navigate disagreements constructively</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Cool down first if emotions are running high</li>
                    <li>• Focus on the specific issue, not past problems</li>
                    <li>• Take turns speaking and listening</li>
                    <li>• Brainstorm solutions together</li>
                    <li>• End with a clear agreement and follow-up plan</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotional" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle>Naming Emotions</CardTitle>
                  <CardDescription>Help children identify feelings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Expand emotional vocabulary beyond "happy," "sad," and "mad"</li>
                    <li>• Use an emotions chart with faces and words</li>
                    <li>• Label your own emotions: "I'm feeling disappointed because..."</li>
                    <li>• Notice and name emotions in books, movies, and real life</li>
                    <li>• Validate all emotions: "It's okay to feel angry"</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Emotion Regulation</CardTitle>
                  <CardDescription>Strategies for managing feelings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Teach deep breathing: "Smell the flower, blow the pinwheel"</li>
                    <li>• Create a calm-down corner with soothing items</li>
                    <li>• Practice counting to 10 before responding</li>
                    <li>• Use physical movement to release emotional energy</li>
                    <li>• Model healthy ways of managing your own emotions</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Empathy Development</CardTitle>
                  <CardDescription>Nurturing understanding of others</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Ask "How do you think they felt when that happened?"</li>
                    <li>• Discuss characters' feelings in stories</li>
                    <li>• Point out others' facial expressions and body language</li>
                    <li>• Talk about the impact of actions on others</li>
                    <li>• Practice perspective-taking through role play</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Emotional Coaching</CardTitle>
                  <CardDescription>Guide children through big feelings</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Be aware of and responsive to emotions</li>
                    <li>• See emotional moments as opportunities for connection</li>
                    <li>• Listen empathetically and validate feelings</li>
                    <li>• Help name emotions when they're struggling to express</li>
                    <li>• Set limits while helping find solutions</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="development" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Growth Mindset</CardTitle>
                  <CardDescription>Cultivating resilience and perseverance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Praise effort, strategy, and process over results</li>
                    <li>• Use "yet" language: "You haven't mastered that yet"</li>
                    <li>• Share stories of your own mistakes and learning</li>
                    <li>• Celebrate challenges as opportunities to grow</li>
                    <li>• Focus on progress rather than perfection</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Age-Appropriate Expectations</CardTitle>
                  <CardDescription>Understanding developmental stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Recognize that developmental stages vary by child</li>
                    <li>• Learn about typical brain development for your child's age</li>
                    <li>• Adjust expectations based on current capabilities</li>
                    <li>• Understand that regression can occur during stress or transitions</li>
                    <li>• Focus on progress rather than comparing to others</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <CardTitle>Curiosity and Learning</CardTitle>
                  <CardDescription>Fostering a love of discovery</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Follow your child's interests and questions</li>
                    <li>• Respond to "why" questions with patience and enthusiasm</li>
                    <li>• Create an environment rich in books and learning materials</li>
                    <li>• Model curiosity by asking questions and seeking answers</li>
                    <li>• Provide hands-on learning experiences and exploration</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <CardTitle>Setting Boundaries</CardTitle>
                  <CardDescription>Balancing freedom with structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Set clear, consistent expectations and consequences</li>
                    <li>• Explain the reasons behind rules to promote understanding</li>
                    <li>• Be firm but kind when enforcing boundaries</li>
                    <li>• Allow age-appropriate choices within boundaries</li>
                    <li>• Adjust boundaries as children demonstrate responsibility</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <CardTitle>Quality Time</CardTitle>
                  <CardDescription>Building connection through presence</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Schedule regular one-on-one time with each child</li>
                    <li>• Be fully present—put away phones and distractions</li>
                    <li>• Let your child choose the activity when possible</li>
                    <li>• Create rituals like bedtime reading or weekend adventures</li>
                    <li>• Even 10-15 minutes of undivided attention makes a difference</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Positive Reinforcement</CardTitle>
                  <CardDescription>Encouraging desired behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Be specific with praise: "I appreciate how you shared your toys"</li>
                    <li>• Focus on effort and progress, not just outcomes</li>
                    <li>• Use a ratio of at least 5 positive comments to 1 negative</li>
                    <li>• Catch them being good—don't only notice misbehavior</li>
                    <li>• Use encouragement ("You worked hard") rather than evaluation ("You're so smart")</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle>Love Languages</CardTitle>
                  <CardDescription>Understanding how your child feels loved</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Observe how your child shows love to others</li>
                    <li>• Notice what makes them light up the most:
                      <ul className="pl-4 pt-1">
                        <li>- Words of affirmation</li>
                        <li>- Quality time</li>
                        <li>- Physical touch</li>
                        <li>- Acts of service</li>
                        <li>- Gifts</li>
                      </ul>
                    </li>
                    <li>• Express love in ways that resonate with them</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle>Repairing Connection</CardTitle>
                  <CardDescription>Healing after conflicts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Model sincere apologies: "I'm sorry I raised my voice. Next time I'll take a break to calm down."</li>
                    <li>• Reconnect after discipline with affection and reassurance</li>
                    <li>• Don't force children to apologize before they're ready</li>
                    <li>• Focus on solutions rather than blame</li>
                    <li>• Remember that repair strengthens relationships</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <CardTitle>Family Traditions</CardTitle>
                  <CardDescription>Creating lasting bonds</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Establish daily rituals like bedtime routines</li>
                    <li>• Create weekly traditions like movie nights or Sunday hikes</li>
                    <li>• Celebrate holidays and milestones in meaningful ways</li>
                    <li>• Pass down family stories and cultural traditions</li>
                    <li>• Be consistent but flexible—adapt traditions as children grow</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary-600">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Newsletter signup */}
        <div className="mt-16 bg-primary-50 rounded-lg p-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold text-gray-900">Get Weekly Parenting Tips</h3>
              <p className="mt-2 text-gray-600">
                Subscribe to our newsletter for practical advice and strategies delivered to your inbox.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:w-1/3">
              <form className="sm:flex">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-4 py-2 text-base text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your email"
                />
                <Button className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
