import { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Shield, 
  Mail, 
  LogOut, 
  Camera,
  ChevronRight,
  Globe,
  Smartphone,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulated preferences state
  const [prefs, setPrefs] = useState({
    theme: 'light',
    language: 'English (United States)',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      daily: true,
      blockers: true,
      weekly: false,
      announcements: false
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSuccess('Settings updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleNotification = (key) => {
    setPrefs(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-premium-black tracking-tight">Account Settings</h1>
        <p className="text-premium-gray mt-1 font-medium">Manage your personal information and application preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-premium-black text-white shadow-lg shadow-black/10' 
                  : 'text-premium-gray hover:bg-premium-beige hover:text-premium-black'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-premium-lightGray">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              Logout Session
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-8"
          >
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex items-center gap-2 text-sm font-bold"
              >
                <Check size={18} /> {success}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 bg-premium-beige border-2 border-premium-lightGray rounded-3xl flex items-center justify-center font-bold text-premium-black text-3xl">
                      {user?.name?.charAt(0)}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-premium-black text-white rounded-xl hover:bg-premium-gray transition-all shadow-lg">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-premium-black">{user?.name}</h3>
                    <p className="text-premium-gray text-sm">{user?.role || 'Team Member'} • {user?.email}</p>
                    <button className="mt-2 text-xs font-bold text-premium-gold hover:underline">Change profile photo</button>
                  </div>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="premium-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="premium-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Role/Position</label>
                    <input type="text" defaultValue={user?.role || 'Full-stack Developer'} className="premium-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Timezone</label>
                    <select className="premium-input appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E")' }}>
                      <option>GMT+5:30 (IST)</option>
                      <option>GMT+0:00 (UTC)</option>
                      <option>GMT-5:00 (EST)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="premium-button-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving Changes...
                        </>
                      ) : (
                        'Save Profile Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-premium-black mb-4">Change Password</h3>
                  <form onSubmit={handleSave} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Current Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} className="premium-input" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-premium-gray">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">New Password</label>
                      <input type="password" className="premium-input" placeholder="Min. 8 characters" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input type="password" className="premium-input" placeholder="Repeat new password" />
                    </div>
                    <button type="submit" className="premium-button-primary w-full">Update Password</button>
                  </form>
                </div>

                <div className="pt-8 border-t border-premium-lightGray">
                  <h3 className="text-lg font-bold text-premium-black mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-premium-beige/30 rounded-2xl border border-premium-lightGray/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Smartphone className="text-premium-gray" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-premium-black">Authenticator App</p>
                        <p className="text-xs text-premium-gray">Use an app like Google Authenticator</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-premium-gold hover:underline">Enable</button>
                  </div>
                </div>

                <div className="pt-8 border-t border-premium-lightGray">
                  <h3 className="text-lg font-bold text-premium-black mb-4">Session Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-premium-lightGray/50 hover:border-premium-gold/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-premium-beige rounded-xl">
                          <Globe className="text-premium-black" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-premium-black">Windows 11 • Chrome Browser</p>
                          <p className="text-xs text-premium-gray">New York, USA • Active now</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">Current</span>
                    </div>
                    <button className="text-sm font-bold text-red-600 hover:underline pl-1 flex items-center gap-2 mt-4">
                      <LogOut size={16} /> Logout from all other devices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-premium-black mb-6">Email Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'daily', title: 'Daily Summary', desc: 'A daily recap of your team\'s stand-up updates.' },
                      { id: 'blockers', title: 'New Blocker Alerts', desc: 'Immediate notification when a teammate reports a blocker.' },
                      { id: 'weekly', title: 'Weekly Reports', desc: 'Insights into team productivity and performance.' },
                      { id: 'announcements', title: 'Team Announcements', desc: 'Stay updated with major workspace changes.' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-bold text-premium-black">{item.title}</p>
                          <p className="text-xs text-premium-gray">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={prefs.notifications[item.id]} 
                            onChange={() => toggleNotification(item.id)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-black"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-premium-lightGray">
                  <h3 className="text-lg font-bold text-premium-black mb-6">Push Notifications</h3>
                  <div className="p-6 bg-premium-beige/20 rounded-2xl border border-dashed border-premium-lightGray text-center">
                    <Bell className="mx-auto text-premium-gray mb-3" size={32} />
                    <p className="text-sm font-bold text-premium-black">Enable desktop notifications</p>
                    <p className="text-xs text-premium-gray mb-4">Stay updated even when you're focused on other tasks.</p>
                    <button className="premium-button-secondary text-xs px-6">Enable Notifications</button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="premium-button-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-premium-black mb-6">Appearance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPrefs(prev => ({ ...prev, theme: 'light' }))}
                      className={`p-4 border-2 rounded-2xl bg-white relative cursor-pointer transition-all ${prefs.theme === 'light' ? 'border-premium-black' : 'border-premium-lightGray opacity-60 hover:opacity-100'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-4 w-4 rounded-full border-4 ${prefs.theme === 'light' ? 'border-premium-black' : 'border-gray-300'}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-premium-black">Default</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-premium-beige rounded"></div>
                        <div className="h-2 w-2/3 bg-premium-beige rounded"></div>
                      </div>
                      <p className="mt-4 text-sm font-bold text-premium-black">Light Mode</p>
                    </div>
                    <div className="p-4 border border-premium-lightGray rounded-2xl bg-gray-900 relative opacity-60 cursor-not-allowed">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-4 w-4 rounded-full border border-gray-700"></div>
                        <Moon className="text-gray-400" size={14} />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-800 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-800 rounded"></div>
                      </div>
                      <p className="mt-4 text-sm font-bold text-gray-400">Dark Mode (Coming Soon)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-premium-lightGray">
                  <h3 className="text-lg font-bold text-premium-black mb-6">Language & Region</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Display Language</label>
                      <select 
                        value={prefs.language}
                        onChange={(e) => setPrefs(prev => ({ ...prev, language: e.target.value }))}
                        className="premium-input appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]" 
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E")' }}
                      >
                        <option>English (United States)</option>
                        <option>Spanish (Español)</option>
                        <option>French (Français)</option>
                        <option>German (Deutsch)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-premium-gray uppercase tracking-widest ml-1">Date Format</label>
                      <select 
                        value={prefs.dateFormat}
                        onChange={(e) => setPrefs(prev => ({ ...prev, dateFormat: e.target.value }))}
                        className="premium-input appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]" 
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E")' }}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="premium-button-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;