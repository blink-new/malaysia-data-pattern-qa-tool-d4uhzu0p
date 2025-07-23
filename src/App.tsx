import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PatternTester } from '@/components/PatternTester';
import { QAInterface } from '@/components/QAInterface';
import { SentenceAnalyzer } from '@/components/SentenceAnalyzer';
import { 
  malaysianNamePatterns, 
  malaysianPhonePatterns, 
  emailPatterns,
  generateTestDataset,
  TestCase
} from '@/utils/malaysianPatterns';
import { User, Phone, Mail, Target, Database, CheckSquare, Search } from 'lucide-react';

function App() {
  const [testDataset] = useState<TestCase[]>(() => generateTestDataset());
  
  const datasetStats = useMemo(() => {
    const stats = {
      name: { total: 0, positive: 0, negative: 0 },
      phone: { total: 0, positive: 0, negative: 0 },
      email: { total: 0, positive: 0, negative: 0 }
    };
    
    testDataset.forEach(testCase => {
      stats[testCase.type].total++;
      if (testCase.expectedMatch) {
        stats[testCase.type].positive++;
      } else {
        stats[testCase.type].negative++;
      }
    });
    
    return stats;
  }, [testDataset]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Malaysia Data Pattern QA Tool
                </h1>
                <p className="text-sm text-gray-600">
                  Regex validation for Malaysian names, phone numbers, and email addresses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {testDataset.length} Test Cases
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analyzer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Sentence Analyzer
            </TabsTrigger>
            <TabsTrigger value="names" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Names ({datasetStats.name.total})
            </TabsTrigger>
            <TabsTrigger value="phones" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phones ({datasetStats.phone.total})
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails ({datasetStats.email.total})
            </TabsTrigger>
          </TabsList>

          {/* Sentence Analyzer Tab */}
          <TabsContent value="analyzer" className="space-y-6">
            <SentenceAnalyzer />
          </TabsContent>

          {/* Names Tab */}
          <TabsContent value="names" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <PatternTester pattern={malaysianNamePatterns} type="Name" />
                
                {/* Dataset Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      Test Dataset Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {datasetStats.name.total}
                        </div>
                        <div className="text-sm text-gray-600">Total Cases</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {datasetStats.name.positive}
                        </div>
                        <div className="text-sm text-gray-600">Should Match</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {datasetStats.name.negative}
                        </div>
                        <div className="text-sm text-gray-600">Should Not Match</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <QAInterface testCases={testDataset} type="name" />
              </div>
            </div>
          </TabsContent>

          {/* Phones Tab */}
          <TabsContent value="phones" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <PatternTester pattern={malaysianPhonePatterns} type="Phone" />
                
                {/* Dataset Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      Test Dataset Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {datasetStats.phone.total}
                        </div>
                        <div className="text-sm text-gray-600">Total Cases</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {datasetStats.phone.positive}
                        </div>
                        <div className="text-sm text-gray-600">Should Match</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {datasetStats.phone.negative}
                        </div>
                        <div className="text-sm text-gray-600">Should Not Match</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <QAInterface testCases={testDataset} type="phone" />
              </div>
            </div>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <PatternTester pattern={emailPatterns} type="Email" />
                
                {/* Dataset Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      Test Dataset Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {datasetStats.email.total}
                        </div>
                        <div className="text-sm text-gray-600">Total Cases</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {datasetStats.email.positive}
                        </div>
                        <div className="text-sm text-gray-600">Should Match</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {datasetStats.email.negative}
                        </div>
                        <div className="text-sm text-gray-600">Should Not Match</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <QAInterface testCases={testDataset} type="email" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;