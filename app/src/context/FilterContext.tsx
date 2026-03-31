"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  minScore: number;
  setMinScore: (v: number) => void;
  maxScore: number;
  setMaxScore: (v: number) => void;
  maxTension: number; 
  setMaxTension: (v: number) => void;
  minMotorization: number;
  setMinMotorization: (v: number) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedDept: string;
  setSelectedDept: (v: string) => void;
  showCriticalOnly: boolean;
  setShowCriticalOnly: (v: boolean) => void;
  mapMetric: "score" | "motorization";
  setMapMetric: (v: "score" | "motorization") => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [maxTension, setMaxTension] = useState(1);
  const [minMotorization, setMinMotorization] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [mapMetric, setMapMetric] = useState<"score" | "motorization">("score");

  return (
    <FilterContext.Provider value={{ 
      minScore, setMinScore, 
      maxScore, setMaxScore,
      maxTension, setMaxTension, 
      minMotorization, setMinMotorization,
      searchQuery, setSearchQuery, 
      selectedDept, setSelectedDept,
      showCriticalOnly, setShowCriticalOnly,
      mapMetric, setMapMetric
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