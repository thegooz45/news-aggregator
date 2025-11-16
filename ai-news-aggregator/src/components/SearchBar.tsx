// src/components/SearchBar.tsx
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 text-lg"
      />
    </div>
  )
}