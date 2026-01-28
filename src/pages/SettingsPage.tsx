import { signOut } from '../db';

export function SettingsPage() {
  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4">
          <h3 className="font-medium mb-2">Account</h3>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-2">About</h3>
          <p className="text-sm text-gray-600">
            BodyAnalyst - Data-driven fitness tracking
          </p>
          <p className="text-xs text-gray-500 mt-1">Version: Prototype v2</p>
        </div>
      </div>
    </div>
  );
}
