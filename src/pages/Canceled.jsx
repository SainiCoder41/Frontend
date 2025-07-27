import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { NavLink } from 'react-router-dom';


export default function Canceled() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm overflow-hidden p-8 text-center">
        {/* Error icon with animated pulse */}
        <div className="mx-auto mb-6 animate-pulse">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-4">
            <XCircle className="text-red-600" size={64} strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payment Canceled</h1>
          <p className="text-gray-600 text-lg">
            No worries - you can try again whenever you're ready
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
       
          <NavLink 
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
>
 <ArrowLeft size={18} />
            Back to Home Page
          </NavLink>
          <button
         
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Need help? <a href="/contact" className="text-red-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}