import React from 'react';
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import DashboardOverview from '../src/components/DashboardOverview';
import { ApiClient } from '../src/utils/api';

// Mock ApiClient responses
vi.mock('../src/utils/api', () => {
  return {
    ApiClient: {
      getComplaints: vi.fn().mockResolvedValue([
        {
          id: 'COMP-2026-001',
          category: 'Water',
          title: 'Pipe Leakage',
          description: 'Water is leaking',
          location: 'Ward 4',
          status: 'submitted',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          updates: [],
          trackingTimeline: []
        }
      ]),
      submitComplaint: vi.fn().mockResolvedValue({ id: 'COMP-NEW' }),
      sendChatMessage: vi.fn().mockResolvedValue({ text: 'Hello citizen!' }),
      simplifyScheme: vi.fn().mockResolvedValue({ text: 'Simplified' }),
      draftLetter: vi.fn().mockResolvedValue({ text: 'Drafted letter' }),
      generateTts: vi.fn().mockResolvedValue({ audio: 'base64audio' })
    }
  };
});

describe('Frontend App Integration & Accessibility Tests', () => {
  beforeEach(() => {
    // Mock window scroll implementation
    window.scrollTo = vi.fn();

    // Mock sessionStorage
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        clear: () => {
          Object.keys(store).forEach((k) => delete store[k]);
        }
      },
      writable: true
    });
  });

  it('renders side navbar brand header and checks accessibility roles', () => {
    render(<App />);

    // Accessibility check: Sidebar header brand should exist
    const brandElement = screen.getAllByText('Nagrik Setu')[0];
    expect(brandElement).toBeInTheDocument();

    // Verify navigation tabs exist
    expect(screen.getByText('Civic Home')).toBeInTheDocument();
    expect(screen.getByText('Talk to Bapu AI')).toBeInTheDocument();
    expect(screen.getByText('Jan Seva Center')).toBeInTheDocument();
    expect(screen.getByText('Grievance Portal')).toBeInTheDocument();
  });

  it('navigates between panels on clicking side navigation buttons', async () => {
    render(<App />);

    // Click on Jan Seva Center
    const serviceTabBtn = screen.getByText('Jan Seva Center');
    fireEvent.click(serviceTabBtn);

    // Verify title for policy simplifier appears
    expect(screen.getByText('Jan Seva Center (Government Directory)')).toBeInTheDocument();
  });

  it('renders Dashboard Bento stats overview widget correctly', () => {
    render(
      <DashboardOverview
        services={[]}
        complaintsCount={10}
        resolvedCount={5}
        onNavigate={vi.fn()}
        onSelectService={vi.fn()}
      />
    );

    // Verify stats figures appear in the widgets
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
