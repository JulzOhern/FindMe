import Image from 'next/image'
import { TabsContent } from './ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react';

async function getPeople(search: string) {
  const response = await fetch(`/api/people?search=${search}`);
  return response.json();
}

export function PeopleTab() {
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("")

  const { data: people } = useQuery({
    queryKey: ['people', debounceSearch],
    queryFn: () => getPeople(debounceSearch)
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [search]);

  return (
    <TabsContent
      value="people"
      className="flex flex-col gap-2 mt-2 overflow-y-auto pr-1"
    >
      {/* Search bar */}
      <div className="sticky top-0 bg-white pb-2 z-10">
        <div className="flex items-center gap-2 w-full px-3 py-2 border rounded-xl bg-gray-100 focus-within:bg-white focus-within:border-gray-300 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.22-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            onChange={e => setSearch(e.target.value)}
            value={search}
            placeholder="Search people..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {(!people || people.length === 0) && (
        <p className="text-gray-500 text-sm text-center py-4">
          No people available.
        </p>
      )}

      {people?.map((item: any) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Left: Avatar + name */}
          <div className="flex items-center gap-3">
            <Image
              src={item.image ?? ""}
              alt={item.name ?? "Unknown user"}
              width={200}
              height={200}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {item.name ?? "Unknown user"}
              </span>
              <span className="text-xs text-gray-500">
                {item.email}
              </span>
            </div>
          </div>

          {/* Right: Add Friend Button */}
          <button className="px-3 py-1.5 text-sm rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all">
            Add
          </button>
        </div>
      ))}
    </TabsContent>
  )
}
