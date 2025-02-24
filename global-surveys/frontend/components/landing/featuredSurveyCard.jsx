import Link from "next/link";
import { Clock, HelpCircle, DollarSign, Star } from "lucide-react";

export default function SurveyCard({ survey }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Card Header with Category Tag */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-3">
              {survey.category || "Featured"}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {survey.title}
            </h3>
          </div>
          {survey.featured && (
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="space-y-3">
          {/* Survey Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-500">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>{survey.questions} questions</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{survey.estimatedTime || "10"} mins</span>
            </div>
          </div>

          {/* Earnings Info */}
          <div className="flex items-center space-x-1 text-green-600">
            <DollarSign className="h-5 w-5" />
            <span className="text-lg font-semibold">{survey.earnings}</span>
            <span className="text-sm text-gray-500">potential earnings</span>
          </div>

          {/* Description if available */}
          {survey.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {survey.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Link
            href={`/survey/${survey.id}`}
            className="block w-full text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
          >
            Start Survey
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{survey.completions || "2,451"} completions</span>
          <span>Success rate: {survey.successRate || "95"}%</span>
        </div>
      </div>
    </div>
  );
}
