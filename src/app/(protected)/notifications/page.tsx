'use client';

import { Bell, Wrench, Code, Rocket, Clock } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-28">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-8 text-center">
        <div className="flex justify-center mb-6">
          <Wrench className="w-16 h-16 text-blue-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Coming Soon!
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          We're working hard to bring you a powerful notification system. Soon you'll be able to stay updated with all your important alerts and updates in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-3">
              <Code className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600">Get instant notifications for all your important activities</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-3">
              <Rocket className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Filtering</h3>
            <p className="text-sm text-gray-600">Customize and organize your notifications your way</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-3">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-sm text-gray-600">We're putting the finishing touches on this feature</p>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Expected launch: Q2 2025
        </div>
      </div>
    </div>
  );
}
