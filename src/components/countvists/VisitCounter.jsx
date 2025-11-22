import { useEffect, useState } from 'react';

// AWS Lambda API Gateway URL
const LAMBDA_API_URL = 'https://not47wmc3f.execute-api.us-east-1.amazonaws.com/';

// Custom hook to track and return GLOBAL visit count from AWS Lambda + DynamoDB
export const useVisitCounter = () => {
  const [visitCount, setVisitCount] = useState(150); // Fallback value while loading

  useEffect(() => {
    const incrementVisitCount = async () => {
      try {
        // Check if already counted in this session (prevent double counting)
        const sessionKey = 'awsVisitCountedThisSession';
        const alreadyCounted = sessionStorage.getItem(sessionKey);

        if (alreadyCounted) {
          // Already counted - just get current value from storage
          const storedCount = sessionStorage.getItem('awsCurrentVisitCount');
          if (storedCount) {
            setVisitCount(parseInt(storedCount, 10));
          }
          return;
        }

        // First visit in session - call Lambda to increment
        const response = await fetch(LAMBDA_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('AWS Lambda response:', data);

        if (data.success && data.visitCount) {
          const count = data.visitCount;
          setVisitCount(count);
          
          // Store in session to prevent double counting
          sessionStorage.setItem(sessionKey, 'true');
          sessionStorage.setItem('awsCurrentVisitCount', count.toString());
        } else {
          console.warn('Unexpected response format:', data);
          setVisitCount(150); // Fallback
        }

      } catch (error) {
        console.error('Error fetching visit count from AWS Lambda:', error);
        
        // Fallback to localStorage if Lambda fails
        const localCount = localStorage.getItem('portfolioVisitCountFallback') || '150';
        const newCount = parseInt(localCount, 10) + 1;
        localStorage.setItem('portfolioVisitCountFallback', newCount.toString());
        setVisitCount(newCount);
      }
    };

    incrementVisitCount();
  }, []);

  return visitCount;
};

const VisitCounter = () => {
  const visitCount = useVisitCounter();
  return visitCount;
};

export default VisitCounter;