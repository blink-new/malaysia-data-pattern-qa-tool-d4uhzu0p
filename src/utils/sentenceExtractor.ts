// Sentence extraction utilities for Malaysian data patterns

export interface ExtractedData {
  type: 'name' | 'phone' | 'email';
  value: string;
  startIndex: number;
  endIndex: number;
}

export interface ExtractionResult {
  originalText: string;
  extractedData: ExtractedData[];
  highlightedText: string;
}

// Enhanced patterns for sentence extraction
export const sentencePatterns = {
  // Malaysian names - more flexible for sentence context
  name: /\b[A-Z][a-z]+(?:\s+(?:bin|binti|s\/o|d\/o|Al-|Ah)\s+[A-Z][a-z]+|\s+[A-Z][a-z]+){1,4}\b/g,
  
  // Malaysian phone numbers - flexible formats
  phone: /(?:\+?6?0?1[0-9][-\s]?[0-9]{7,8}|\+?6?0?[3-9][-\s]?[0-9]{7,8})/g,
  
  // Email addresses
  email: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g
};

// Get color class for different data types
const getColorClass = (type: 'name' | 'phone' | 'email'): string => {
  switch (type) {
    case 'name':
      return 'bg-yellow-200 px-1 rounded font-medium';
    case 'phone':
      return 'bg-blue-200 px-1 rounded font-medium';
    case 'email':
      return 'bg-green-200 px-1 rounded font-medium';
    default:
      return 'bg-gray-200 px-1 rounded font-medium';
  }
};

// Create highlighted HTML text
const createHighlightedText = (text: string, extractedData: ExtractedData[]): string => {
  if (extractedData.length === 0) return text;
  
  let result = '';
  let lastIndex = 0;
  
  extractedData.forEach(data => {
    // Add text before the match
    result += text.slice(lastIndex, data.startIndex);
    
    // Add highlighted match with color coding
    const colorClass = getColorClass(data.type);
    result += `<span class="${colorClass}">${data.value}</span>`;
    
    lastIndex = data.endIndex;
  });
  
  // Add remaining text
  result += text.slice(lastIndex);
  
  return result;
};

// Extract all data types from a sentence
export const extractFromSentence = (sentence: string): ExtractionResult => {
  const extractedData: ExtractedData[] = [];
  
  // Extract names
  const nameMatches = Array.from(sentence.matchAll(sentencePatterns.name));
  nameMatches.forEach(match => {
    if (match.index !== undefined) {
      extractedData.push({
        type: 'name',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  });
  
  // Extract phone numbers
  const phoneMatches = Array.from(sentence.matchAll(sentencePatterns.phone));
  phoneMatches.forEach(match => {
    if (match.index !== undefined) {
      extractedData.push({
        type: 'phone',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  });
  
  // Extract emails
  const emailMatches = Array.from(sentence.matchAll(sentencePatterns.email));
  emailMatches.forEach(match => {
    if (match.index !== undefined) {
      extractedData.push({
        type: 'email',
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  });
  
  // Sort by start index to maintain order
  extractedData.sort((a, b) => a.startIndex - b.startIndex);
  
  // Create highlighted text
  const highlightedText = createHighlightedText(sentence, extractedData);
  
  return {
    originalText: sentence,
    extractedData,
    highlightedText
  };
};

// Sample test sentences
export const sampleSentences = [
  "Hi, my name is Ahmad bin Abdullah and you can reach me at 012-3456789 or email me at ahmad.abdullah@gmail.com",
  "Please contact Siti Nurhaliza at +60123456789 or siti.nurhaliza@yahoo.com.my for more information",
  "Lim Wei Ming from Kuala Lumpur can be reached at 03-12345678 or lim.weiming@company.my",
  "Dr. Rajesh s/o Krishnan is available at 019-8765432 and his email is rajesh.krishnan@hospital.my",
  "For urgent matters, call Tan Ah Kow at +603-87654321 or send an email to tan.ahkow@business.com.my",
  "Priya d/o Raman works at the office, her contact is 017-2345678 and email priya.raman@office.org",
  "Muhammad Al-Fatih can be contacted via phone 016-9876543 or email muhammad.alfatih@university.edu.my",
  "Lee Chong Wei's assistant can be reached at 04-1234567 or assistant@leechongwei.com",
  "Contact our customer service team at 1300-88-1234 or support@company.com.my for assistance",
  "The meeting with Wong Kar Wai is scheduled for tomorrow, please call 082-765432 or email wong.karwai@film.my"
];