import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Users, BookOpen, Target } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Insights() {
  // Fetch recordings to calculate aggregated insights
  const { data: recordings, isLoading, isError } = useQuery({
    queryKey: ["/api/recordings"],
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Calculate communication style metrics
  const calculateCommunicationMetrics = () => {
    if (!recordings || recordings.length === 0) return null;
    
    let openEndedQuestionsTotal = 0;
    let activeListeningTotal = 0;
    let emotionalSupportTotal = 0;
    let count = 0;
    
    recordings.forEach((recording: any) => {
      if (recording.analysis && recording.analysis.communicationStyle) {
        openEndedQuestionsTotal += recording.analysis.communicationStyle.openEndedQuestions || 0;
        activeListeningTotal += recording.analysis.communicationStyle.activeListening || 0;
        emotionalSupportTotal += recording.analysis.communicationStyle.emotionalSupport || 0;
        count++;
      }
    });
    
    if (count === 0) return null;
    
    return {
      openEndedQuestions: Math.round(openEndedQuestionsTotal / count),
      activeListening: Math.round(activeListeningTotal / count),
      emotionalSupport: Math.round(emotionalSupportTotal / count)
    };
  };

  // Calculate topic distribution
  const calculateTopicDistribution = () => {
    if (!recordings || recordings.length === 0) return [];
    
    const topicCounts: Record<string, number> = {};
    let totalEntries = 0;
    
    recordings.forEach((recording: any) => {
      if (recording.analysis && recording.analysis.topics) {
        recording.analysis.topics.forEach((topic: any) => {
          topicCounts[topic.name] = (topicCounts[topic.name] || 0) + 1;
          totalEntries++;
        });
      }
    });
    
    // Convert to array and calculate percentages
    return Object.entries(topicCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalEntries) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // Top 5 topics
  };

  // Collect growth areas
  const collectGrowthAreas = () => {
    if (!recordings || recordings.length === 0) return [];
    
    const areas: any[] = [];
    
    recordings.forEach((recording: any) => {
      if (recording.analysis && recording.analysis.growthAreas) {
        recording.analysis.growthAreas.forEach((area: any) => {
          // Check if we already have this area
          const existingArea = areas.find(a => a.area === area.area);
          if (!existingArea) {
            areas.push(area);
          }
        });
      }
    });
    
    return areas.sort((a, b) => {
      const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  };

  const communicationMetrics = calculateCommunicationMetrics();
  const topicDistribution = calculateTopicDistribution();
  const growthAreas = collectGrowthAreas();
  
  return (
    <div>
      {/* Hero section */}
      <div className="bg-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Parenting Insights</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Gain valuable insights into your parenting communication style and discover
              opportunities for growth and improvement in your family conversations.
            </p>
          </div>
        </div>
      </div>

      {/* Insights dashboard */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communication">Communication Style</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="growth">Growth Areas</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load insights data. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Communication Style Card */}
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                          <Users className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-neutral-900">Communication Style</h3>
                          <p className="text-sm text-neutral-500">Based on {recordings?.length || 0} conversations</p>
                        </div>
                      </div>
                      {communicationMetrics ? (
                        <div className="mt-6">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  Open-Ended Questions
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  {communicationMetrics.openEndedQuestions}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                              <div 
                                style={{width: `${communicationMetrics.openEndedQuestions}%`}} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                              ></div>
                            </div>
                          </div>
                          
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  Active Listening
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  {communicationMetrics.activeListening}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                              <div 
                                style={{width: `${communicationMetrics.activeListening}%`}} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                              ></div>
                            </div>
                          </div>
                          
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  Emotional Support
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  {communicationMetrics.emotionalSupport}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
                              <div 
                                style={{width: `${communicationMetrics.emotionalSupport}%`}} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          Not enough data to display metrics
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Topics of Interest Card */}
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
                          <BookOpen className="h-6 w-6 text-secondary-600" />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-neutral-900">Topics of Interest</h3>
                          <p className="text-sm text-neutral-500">Most discussed subjects</p>
                        </div>
                      </div>
                      {topicDistribution.length > 0 ? (
                        <div className="mt-6 space-y-4">
                          {topicDistribution.map((topic, i) => (
                            <div key={i} className="flex items-center">
                              <div className="w-2/5">
                                <span className="text-sm font-medium text-neutral-700">{topic.name}</span>
                              </div>
                              <div className="w-3/5 flex items-center">
                                <div className="bg-blue-100 h-2.5 rounded-full w-full">
                                  <div 
                                    className="bg-blue-500 h-2.5 rounded-full" 
                                    style={{width: `${topic.percentage}%`}}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-neutral-700 ml-2">{topic.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No topic data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Growth Areas Card */}
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 bg-accent-100 rounded-md p-3">
                          <Target className="h-6 w-6 text-accent-600" />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-medium text-neutral-900">Growth Areas</h3>
                          <p className="text-sm text-neutral-500">Focus on these opportunities</p>
                        </div>
                      </div>
                      {growthAreas.length > 0 ? (
                        <div className="mt-6 space-y-4">
                          {growthAreas.slice(0, 3).map((area, i) => (
                            <div key={i} className="rounded-md bg-white shadow-sm">
                              <div className="p-4">
                                <h4 className="text-sm font-medium text-neutral-900">{area.area}</h4>
                                <p className="mt-1 text-xs text-neutral-500">{area.description}</p>
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    area.priority === "High" 
                                      ? "bg-red-100 text-red-800" 
                                      : area.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}>
                                    Priority: {area.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No growth areas identified yet
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Communication Style Analysis</h2>
                    
                    {communicationMetrics ? (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Open-Ended Questions</h3>
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div className="text-right">
                                <span className="text-sm font-semibold text-primary-600">
                                  {communicationMetrics.openEndedQuestions}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-primary-100">
                              <div 
                                style={{width: `${communicationMetrics.openEndedQuestions}%`}} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 rounded-full"
                              ></div>
                            </div>
                          </div>
                          <p className="text-gray-600">
                            Open-ended questions encourage your child to express themselves more freely and think critically.
                            They typically begin with "what," "how," "why," or phrases like "tell me about."
                          </p>
                          
                          <div className="bg-primary-50 p-4 rounded-md mt-2">
                            <h4 className="font-medium text-primary-900 mb-2">Tips to improve:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-primary-800 text-sm">
                              <li>Instead of "Did you have fun at school?" try "What was the most interesting thing you did at school today?"</li>
                              <li>Replace "Was your teacher nice?" with "How did your teacher help you learn today?"</li>
                              <li>Avoid questions that can be answered with just "yes" or "no"</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Active Listening</h3>
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div className="text-right">
                                <span className="text-sm font-semibold text-primary-600">
                                  {communicationMetrics.activeListening}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-primary-100">
                              <div 
                                style={{width: `${communicationMetrics.activeListening}%`}} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 rounded-full"
                              ></div>
                            </div>
                          </div>
                          <p className="text-gray-600">
                            Active listening involves fully concentrating, understanding, responding, and remembering
                            what your child is saying. It shows that you value their thoughts and feelings.
                          </p>
                          
                          <div className="bg-primary-50 p-4 rounded-md mt-2">
                            <h4 className="font-medium text-primary-900 mb-2">Tips to improve:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-primary-800 text-sm">
                              <li>Use verbal acknowledgments like "I see," "That's interesting," or "Tell me more"</li>
                              <li>Reflect back what you heard to confirm understanding: "So what you're saying is..."</li>
                              <li>Put away distractions like phones when your child is talking to you</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Emotional Support</h3>
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div className="text-right">
                                <span className="text-sm font-semibold text-primary-600">
                                  {communicationMetrics.emotionalSupport}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-primary-100">
                              <div 
                                style={{width: `${communicationMetrics.emotionalSupport}%`}} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 rounded-full"
                              ></div>
                            </div>
                          </div>
                          <p className="text-gray-600">
                            Emotional support involves validating your child's feelings, providing comfort,
                            and helping them develop emotional intelligence and resilience.
                          </p>
                          
                          <div className="bg-primary-50 p-4 rounded-md mt-2">
                            <h4 className="font-medium text-primary-900 mb-2">Tips to improve:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-primary-800 text-sm">
                              <li>Validate feelings: "It's okay to feel sad/angry/frustrated about that"</li>
                              <li>Help name emotions: "You seem disappointed that didn't work out"</li>
                              <li>Share appropriate emotional experiences of your own to normalize feelings</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                        <p>
                          Upload more conversations to get detailed insights into your communication style.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="topics" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Topics Analysis</h2>
                    
                    {topicDistribution.length > 0 ? (
                      <div>
                        <p className="text-gray-600 mb-6">
                          These are the most common topics that appear in your conversations with your child.
                          Understanding these patterns can help you identify their interests and concerns.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Topic Distribution</h3>
                            <div className="space-y-6">
                              {topicDistribution.map((topic, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-gray-900">{topic.name}</h4>
                                    <span className="text-sm text-gray-500">{topic.percentage}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className={`h-3 rounded-full ${
                                        i === 0 ? "bg-blue-500" :
                                        i === 1 ? "bg-green-500" :
                                        i === 2 ? "bg-purple-500" :
                                        i === 3 ? "bg-yellow-500" :
                                        "bg-red-500"
                                      }`} 
                                      style={{width: `${topic.percentage}%`}}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">Engagement Opportunities</h3>
                            <div className="space-y-4">
                              {topicDistribution.slice(0, 3).map((topic, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-md">
                                  <h4 className="font-medium text-gray-900 mb-2">{topic.name}</h4>
                                  <p className="text-sm text-gray-600 mb-3">
                                    Your child shows significant interest in this topic. Consider finding ways to engage more deeply.
                                  </p>
                                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Suggested activities:</h5>
                                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                                    {topic.name === "School" && (
                                      <>
                                        <li>Visit a science museum or educational exhibit together</li>
                                        <li>Participate in school events and volunteer opportunities</li>
                                        <li>Create learning games that make education fun</li>
                                      </>
                                    )}
                                    {topic.name === "Friends" && (
                                      <>
                                        <li>Host playdates or social gatherings</li>
                                        <li>Role-play social scenarios to build confidence</li>
                                        <li>Discuss qualities of good friendships</li>
                                      </>
                                    )}
                                    {topic.name === "Hobbies" && (
                                      <>
                                        <li>Enroll in classes related to their interests</li>
                                        <li>Set aside dedicated time for hobby exploration</li>
                                        <li>Join community groups related to their hobbies</li>
                                      </>
                                    )}
                                    {topic.name === "Emotions" && (
                                      <>
                                        <li>Create an emotions chart to help identify feelings</li>
                                        <li>Read books about emotional intelligence</li>
                                        <li>Practice mindfulness exercises together</li>
                                      </>
                                    )}
                                    {topic.name === "Family" && (
                                      <>
                                        <li>Create family traditions and rituals</li>
                                        <li>Look through family photos and share stories</li>
                                        <li>Plan regular family outings or game nights</li>
                                      </>
                                    )}
                                    {!["School", "Friends", "Hobbies", "Emotions", "Family"].includes(topic.name) && (
                                      <>
                                        <li>Find books, movies or activities related to this interest</li>
                                        <li>Ask open-ended questions to explore this topic deeper</li>
                                        <li>Connect with community resources related to this interest</li>
                                      </>
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No topic data available</h3>
                        <p>
                          Upload more conversations to see analysis of the topics you discuss with your child.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="growth" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Growth Opportunities</h2>
                    
                    {growthAreas.length > 0 ? (
                      <div className="space-y-6">
                        <p className="text-gray-600">
                          Based on your conversations, we've identified these areas where focused attention
                          could improve your family communication and connection.
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {growthAreas.map((area, i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-5 bg-white">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-gray-900">{area.area}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  area.priority === "High" 
                                    ? "bg-red-100 text-red-800" 
                                    : area.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {area.priority} Priority
                                </span>
                              </div>
                              <p className="text-gray-600 mb-4">{area.description}</p>
                              
                              <div className="bg-gray-50 p-4 rounded-md">
                                <h4 className="font-medium text-gray-900 mb-2">Action plan:</h4>
                                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                  {area.area.includes("follow-up") && (
                                    <>
                                      <li>Set a reminder to revisit important topics from previous conversations</li>
                                      <li>Keep a journal of key interests your child mentions</li>
                                      <li>Ask specific questions about previous activities or interests</li>
                                    </>
                                  )}
                                  {area.area.includes("question") && (
                                    <>
                                      <li>Practice rephrasing closed questions into open-ended ones</li>
                                      <li>Use "what", "how", and "why" more frequently</li>
                                      <li>Create a list of conversation starters that encourage detailed responses</li>
                                    </>
                                  )}
                                  {area.area.includes("listen") && (
                                    <>
                                      <li>Practice reflective listening by repeating back what you heard</li>
                                      <li>Remove distractions during conversation time</li>
                                      <li>Wait 3-5 seconds after your child stops talking before responding</li>
                                    </>
                                  )}
                                  {area.area.includes("emotion") && (
                                    <>
                                      <li>Label emotions in yourself and others during conversations</li>
                                      <li>Validate feelings before offering solutions</li>
                                      <li>Share appropriate emotions of your own to model emotional expression</li>
                                    </>
                                  )}
                                  {area.area.includes("problem") && (
                                    <>
                                      <li>Ask "What do you think would work?" before offering solutions</li>
                                      <li>Break down problems into smaller, manageable steps</li>
                                      <li>Acknowledge effort in problem-solving, not just results</li>
                                    </>
                                  )}
                                  {area.area.includes("humor") && (
                                    <>
                                      <li>Share funny stories or jokes during family time</li>
                                      <li>Point out absurd or silly situations in everyday life</li>
                                      <li>Create family inside jokes or playful traditions</li>
                                    </>
                                  )}
                                  {!["follow-up", "question", "listen", "emotion", "problem", "humor"].some(keyword => area.area.toLowerCase().includes(keyword)) && (
                                    <>
                                      <li>Set aside dedicated time to practice this skill</li>
                                      <li>Seek resources like books or videos about this topic</li>
                                      <li>Track progress by recording conversations before and after focused practice</li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No growth areas identified yet</h3>
                        <p>
                          As you upload more conversations, we'll identify specific areas where you can
                          focus to improve your communication and connection with your child.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
