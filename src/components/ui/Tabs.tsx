"use client";

type Tab = {
  id: string;
  label: string;
  testId: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
};

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div
      data-testid="course-tabs"
      role="tablist"
      className="mb-6 flex gap-1 border-b border-gray-200"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          data-testid={tab.testId}
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            activeTab === tab.id
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
