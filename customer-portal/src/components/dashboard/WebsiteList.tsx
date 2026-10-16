import React, { useState } from 'react';
import { Globe, Plus, Search } from 'lucide-react';
import { Website, HostingPlan } from '@/types/hosting';
import { WebsiteRow } from '@/components/dashboard/WebsiteRow';

interface WebsiteListProps {
  websites: Website[];
  plan: HostingPlan;
  onAddWebsite: () => void;
  onManageWebsite: (website: Website) => void;
  onOpenDetails: (website: Website) => void;
  onDeleteRequest: (website: Website) => void;
}

export const WebsiteList: React.FC<WebsiteListProps> = ({
  websites,
  plan,
  onAddWebsite,
  onManageWebsite,
  onOpenDetails,
  onDeleteRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = websites.filter((site) =>
    site.domain.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <section className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs overflow-hidden">
      {/* List Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Websites & Domains
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-semibold">
            {websites.length} of {plan.domainLimit}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle search if > 1 websites */}
          {websites.length > 1 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter domains..."
                className="w-36 sm:w-44 pl-8 pr-3 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8702a] transition-colors"
              />
            </div>
          )}

          <button
            type="button"
            onClick={onAddWebsite}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#e8702a]" />
            <span>Add Website</span>
          </button>
        </div>
      </div>

      {/* Website rows with inner scrolling or empty state */}
      {filteredWebsites.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pt-3 pr-1">
          {filteredWebsites.map((website) => (
            <WebsiteRow
              key={website.id}
              website={website}
              plan={plan}
              onManageClick={onManageWebsite}
              onOpenDetails={onOpenDetails}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] mb-2.5">
            <Globe className="w-5 h-5 stroke-[1.8]" />
          </div>
          <p className="text-sm font-bold text-gray-900">No websites found</p>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-3">
            {searchQuery
              ? `No websites match your filter "${searchQuery}".`
              : 'You have not added any websites to this hosting plan yet.'}
          </p>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#e8702a] hover:underline"
            >
              Clear filter
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddWebsite}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-sm shadow-[#e8702a]/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add your first website</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
