import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center space-y-6">
        {/* Checkmark with circle background */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 bg-green-50 rounded-full">
          <CheckCircle className="text-green-500" size={48} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
          <p className="text-gray-600">Thank you for your purchase!</p>
        </div>

        {/* Session ID - subtle and contained */}
        {sessionId && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-mono break-all">Transaction: {sessionId}</p>
          </div>
        )}

        {/* Single primary button */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}