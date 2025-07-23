import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, User, Phone, Mail, Lightbulb } from 'lucide-react';
import { extractFromSentence, sampleSentences, ExtractedData } from '@/utils/sentenceExtractor';

export const SentenceAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [highlightedText, setHighlightedText] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    const result = extractFromSentence(inputText);
    setExtractedData(result.extractedData);
    setHighlightedText(result.highlightedText);
    setIsAnalyzed(true);
  };

  const handleSampleClick = (sample: string) => {
    setInputText(sample);
    const result = extractFromSentence(sample);
    setExtractedData(result.extractedData);
    setHighlightedText(result.highlightedText);
    setIsAnalyzed(true);
  };

  const handleClear = () => {
    setInputText('');
    setExtractedData([]);
    setHighlightedText('');
    setIsAnalyzed(false);
  };

  const getTypeIcon = (type: 'name' | 'phone' | 'email') => {
    switch (type) {
      case 'name':
        return <User className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: 'name' | 'phone' | 'email') => {
    switch (type) {
      case 'name':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'phone':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'email':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const groupedData = extractedData.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, ExtractedData[]>);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Sentence Analyzer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter a sentence to extract and highlight Malaysian names, phone numbers, and email addresses
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter your sentence here... (e.g., Hi, my name is Ahmad bin Abdullah and you can reach me at 012-3456789 or email me at ahmad.abdullah@gmail.com)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={!inputText.trim()}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Analyze
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear}
              disabled={!inputText && !isAnalyzed}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isAnalyzed && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <p className="text-sm text-gray-600">
              Found {extractedData.length} data pattern{extractedData.length !== 1 ? 's' : ''}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Highlighted Text */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Highlighted Text:</h4>
              <div 
                className="p-4 bg-gray-50 rounded-lg border text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                  <span>Names</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span>Phone Numbers</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>Email Addresses</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Extracted Data Summary */}
            {extractedData.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Extracted Data:</h4>
                <div className="space-y-3">
                  {Object.entries(groupedData).map(([type, items]) => (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(type as 'name' | 'phone' | 'email')}
                        <span className="text-sm font-medium capitalize">{type}s ({items.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className={getTypeColor(item.type)}
                          >
                            {item.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No Malaysian names, phone numbers, or email addresses found in the text.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sample Sentences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Sample Sentences
          </CardTitle>
          <p className="text-sm text-gray-600">
            Click on any sample sentence to test the analyzer
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sampleSentences.map((sentence, index) => (
              <button
                key={index}
                onClick={() => handleSampleClick(sentence)}
                className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
              >
                {sentence}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};