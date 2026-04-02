function AdminTabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="admin-tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`admin-tabs-bar__item ${
            activeTab === tab.value ? "admin-tabs-bar__item--active" : ""
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;