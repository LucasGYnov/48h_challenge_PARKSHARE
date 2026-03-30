"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  minScore: number;
  setMinScore: (v: number) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedDept: string;
  setSelectedDept: (v: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [minScore, setMinScore] = useState(0);
  const [maxPrice, setMaxPrice] = useState(250);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  return (
    <FilterContext.Provider value={{ 
      minScore, setMinScore, maxPrice, setMaxPrice, 
      searchQuery, setSearchQuery, selectedDept, setSelectedDept 
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilters must be used within FilterProvider");
  return context;
}