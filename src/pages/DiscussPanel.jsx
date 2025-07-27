import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Plus,
  Clock,
  User,
  ArrowUpRight,
  BadgeCheck
} from 'lucide-react';

const DiscussPanel = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filter, setFilter] = useState('all');
  const [expandedPost, setExpandedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data fetch
  useEffect(() => {
    const fetchDiscussions = async () => {
      // Simulate API call
      setTimeout(() => {
        setDiscussions([
          {
            id: 1,
            title: 'Two Sum Solution Explained',
            content: 'Here\'s a detailed explanation of the Two Sum problem with O(n) time complexity solution using hash maps...',
            author: 'coding_pro',
            authorVerified: true,
            votes: 245,
            comments: 32,
            tags: ['Array', 'Hash Table'],
            timestamp: '2 hours ago',
            solutionCode: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}'
          },
          {
            id: 2,
            title: 'Binary Tree Inorder Traversal - Iterative vs Recursive',
            content: 'Comparing both approaches with complexity analysis and when to use each...',
            author: 'tree_master',
            authorVerified: false,
            votes: 189,
            comments: 24,
            tags: ['Binary Tree', 'Recursion', 'Stack'],
            timestamp: '5 hours ago'
          },
          {
            id: 3,
            title: 'Dynamic Programming Patterns Cheat Sheet',
            content: 'Compiled list of common DP patterns with example problems for each...',
            author: 'dp_wizard',
            authorVerified: true,
            votes: 512,
            comments: 87,
            tags: ['Dynamic Programming', 'Memoization'],
            timestamp: '1 day ago'
          },
          {
            id: 4,
            title: 'System Design: TinyURL',
            content: 'My approach to designing a URL shortening service with scalability considerations...',
            author: 'system_designer',
            authorVerified: false,
            votes: 321,
            comments: 45,
            tags: ['System Design', 'Distributed Systems'],
            timestamp: '2 days ago'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchDiscussions();
  }, []);

  const handleVote = (id, direction) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === id) {
        return {
          ...discussion,
          votes: direction === 'up' ? discussion.votes + 1 : discussion.votes - 1
        };
      }
      return discussion;
    }));
  };

  const toggleExpand = (id) => {
    setExpandedPost(expandedPost === id ? null : id);
  };

  const filteredDiscussions = discussions
    .filter(discussion => 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'comments') return b.comments - a.comments;
      return 0;
    })
    .filter(discussion => {
      if (filter === 'all') return true;
      if (filter === 'solutions') return discussion.tags.includes('Solution');
      if (filter === 'questions') return !discussion.tags.includes('Solution');
      return discussion.tags.includes(filter);
    });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
          <MessageSquare className="mr-2 text-blue-600" />
          Discussion Forum
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search discussions..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="votes">Most Votes</option>
                <option value="comments">Most Comments</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Topics</option>
                <option value="solutions">Solutions</option>
                <option value="questions">Questions</option>
                <option value="Array">Array</option>
                <option value="Dynamic Programming">DP</option>
                <option value="System Design">System Design</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Discussion List */}
      {!loading && (
        <div className="space-y-4">
          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No discussions found matching your criteria</p>
            </div>
          ) : (
            filteredDiscussions.map(discussion => (
              <div key={discussion.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                        {discussion.title}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-2">{discussion.author}</span>
                        {discussion.authorVerified && (
                          <BadgeCheck className="h-4 w-4 text-blue-500 mr-2" />
                        )}
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{discussion.timestamp}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                            onClick={() => setFilter(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center ml-4">
                      <button 
                        onClick={() => handleVote(discussion.id, 'up')}
                        className="p-1 text-gray-500 hover:text-green-600"
                      >
                        <ChevronUp className="h-5 w-5" />
                      </button>
                      <span className={`font-medium my-1 ${discussion.votes > 0 ? 'text-green-600' : discussion.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {discussion.votes}
                      </span>
                      <button 
                        onClick={() => handleVote(discussion.id, 'down')}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <ChevronDown className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">
                      {expandedPost === discussion.id 
                        ? discussion.content 
                        : `${discussion.content.substring(0, 200)}...`}
                    </p>
                    {discussion.solutionCode && expandedPost === discussion.id && (
                      <div className="mt-4 bg-gray-800 rounded-md p-4 overflow-x-auto">
                        <pre className="text-gray-200 text-sm">
                          <code>{discussion.solutionCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => toggleExpand(discussion.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      {expandedPost === discussion.id ? 'Show less' : 'Read more'}
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </button>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {discussion.comments} comments
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-600 text-sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DiscussPanel;