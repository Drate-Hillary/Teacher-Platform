'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ExamConfiguration } from '@/context/AssessmentContext'; 
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Shield, Globe02Icon, Camera02Icon, MonitorDot, LockKeyIcon } from '@hugeicons/core-free-icons';

interface AntiCheatingSettingsProps {
  settings: ExamConfiguration['antiCheating'];
  onChange: (settings: ExamConfiguration['antiCheating']) => void;
}

export default function AntiCheatingSettings({ settings, onChange }: AntiCheatingSettingsProps) {
  const settingsList = [
    {
      key: 'browserLockdown' as const,
      icon: LockKeyIcon,
      title: 'Browser Lockdown',
      description: 'Prevent students from opening other browsers or applications',
      warning: 'Requires students to install browser extension',
    },
    {
      key: 'tabSwitchAlert' as const,
      icon: MonitorDot,
      title: 'Tab Switch Detection',
      description: 'Alert when students switch tabs or windows during the exam',
    },
    {
      key: 'fullScreenRequired' as const,
      icon: MonitorDot,
      title: 'Full Screen Mode',
      description: 'Require students to remain in full-screen mode throughout the exam',
      warning: 'Exam auto-submits if full-screen is exited',
    },
    {
      key: 'cameraProctoring' as const,
      icon: Camera02Icon,
      title: 'Camera Proctoring',
      description: 'Use webcam to monitor students during the exam',
      warning: 'Requires camera access and may not be available for all students',
    },
    {
      key: 'ipTracking' as const,
      icon: Globe02Icon,
      title: 'IP Address Tracking',
      description: 'Log and monitor IP addresses to detect suspicious activity',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <HugeiconsIcon icon={Shield} className="h-5 w-5" />
          Anti-Cheating Measures
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure security settings to maintain assessment integrity
        </p>
      </div>

      <div className="space-y-4">
        {settingsList.map(({ key, icon: Icon, title, description, warning }) => (
          <div key={key} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <HugeiconsIcon icon={Icon} className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <Label className="text-base">{title}</Label>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                  {warning && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-yellow-600 bg-yellow-50 rounded-lg p-2">
                      <HugeiconsIcon icon={Alert02Icon} className="h-4 w-4 shrink-0" />
                      {warning}
                    </div>
                  )}
                </div>
              </div>
              <Switch
                checked={settings[key]}
                onCheckedChange={(checked) =>
                  onChange({ ...settings, [key]: checked })
                }
              />
            </div>
          </div>
        ))}
      </div>

      {Object.values(settings).some(Boolean) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HugeiconsIcon icon={Shield} className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Security Level: {
                Object.values(settings).filter(Boolean).length >= 4
                  ? 'High'
                  : Object.values(settings).filter(Boolean).length >= 2
                  ? 'Medium'
                  : 'Basic'
              }</p>
              <p className="mt-1">
                {
                  Object.values(settings).filter(Boolean).length
                } anti-cheating measure(s) active. Students will be notified of these requirements before starting the assessment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}