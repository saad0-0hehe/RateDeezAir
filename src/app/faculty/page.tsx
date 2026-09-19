'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProfessorsWithStats } from '@/lib/data';
import { DEPARTMENTS, Professor } from '@/lib/types';
import FacultyCard from '@/components/FacultyCard';
import Link from 'next/link';

export default function FacultyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize state from URL params so it persists across navigation
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('dept') || 'all');
    const [allProfessors, setAllProfessors] = useState<(Professor & { stats: any })[]>([]);
    const [loading, setLoading] = useState(true);

    // Sync state changes to URL (without full page reload)
    const updateURL = useCallback((query: string, dept: string) => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (dept && dept !== 'all') params.set('dept', dept);
        const paramString = params.toString();
        router.replace(`/faculty${paramString ? `?${paramString}` : ''}`, { scroll: false });
    }, [router]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        updateURL(value, selectedDepartment);
    };

    const handleDepartmentChange = (value: string) => {
        setSelectedDepartment(value);
        updateURL(searchQuery, value);
    };

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getAllProfessorsWithStats();
                setAllProfessors(data);
            } catch (error) {
                console.error('Failed to load professors:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Client-side filtering
    const filteredProfessors = allProfessors.filter(p => {
        const matchesSearch = !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDepartment === 'all' || p.department === selectedDepartment;
        return matchesSearch && matchesDept;
    });

    // Get unique departments from professors
    const activeDepartments = [...new Set(allProfessors.map((p) => p.department))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div
                    className="w-6 h-6 border-2 border-t-transparent animate-spin"
                    style={{
                        borderColor: 'var(--color-border)',
                        borderTopColor: 'var(--color-blue)',
                        borderRadius: 'var(--radius-full)',
                    }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
                        Faculty Directory
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-2)' }}>
                        Browse and rate professors at Air University Islamabad
                    </p>
                </div>
                <Link
                    href="/add-faculty"
                    className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 transition-colors flex-shrink-0"
                    style={{
                        color: '#fff',
                        backgroundColor: 'var(--color-blue)',
                        borderRadius: 'var(--radius-sm)',
                    }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Faculty
                </Link>
            </div>
            {/* Blue rule under heading */}
            <div className="rda-section-rule" />


            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="flex-1 relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: 'var(--color-ink-3)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or department…"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm outline-none transition-colors"
                        style={{
                            border: '2px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#fff',
                            color: 'var(--color-ink)',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    />
                </div>

                {/* Department Filter */}
                <div className="sm:w-56">
                    <select
                        value={selectedDepartment}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm outline-none transition-colors appearance-none cursor-pointer"
                        style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#fff',
                            color: 'var(--color-ink)',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    >
                        <option value="all">All Departments</option>
                        {activeDepartments.sort().map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results count */}
            <p className="text-xs mb-4" style={{ color: 'var(--color-ink-3)' }}>
                Showing {filteredProfessors.length} of {allProfessors.length} professors
            </p>

            {/* List */}
            {filteredProfessors.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {filteredProfessors.map((professor) => (
                        <FacultyCard key={professor.id} professor={professor} stats={professor.stats} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-sm" style={{ color: 'var(--color-ink-3)' }}>
                        No professors found matching your search.
                    </p>
                </div>
            )}
        </div>
    );
}
