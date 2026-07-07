import { Complaint } from '../types';
import { Logger } from './logger';

/**
 * API Client Utility for Nagrik Setu
 * Centralizes all asynchronous HTTP requests to the backend server with standard error handling.
 */

/**
 * Generic response handler that logs errors and parses JSON response safely.
 *
 * @template T
 * @param {Response} response - The Fetch response object to process
 * @returns {Promise<T>} A promise resolving to the parsed JSON response
 * @throws {Error} Throws an error containing status and detail message if request is not ok
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    Logger.error(`API Request failed with status ${response.status}`, errorText);
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const ApiClient = {
  /**
   * Fetch all registered complaints from the server.
   * @returns Array of Complaint objects
   */
  getComplaints: async (): Promise<Complaint[]> => {
    Logger.info('Fetching complaints');
    const response = await fetch('/api/complaints');
    return handleResponse<Complaint[]>(response);
  },

  /**
   * Submit a new complaint / grievance.
   * @param complaintData Form data of the complaint
   * @returns The newly created Complaint object
   */
  submitComplaint: async (complaintData: Partial<Complaint>): Promise<Complaint> => {
    Logger.info('Submitting new complaint', complaintData.title);
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData)
    });
    return handleResponse<Complaint>(response);
  },

  /**
   * Post an update/comment to an existing complaint.
   * @param id Complaint ID
   * @param text Update note text
   * @param author Name of the author posting the comment
   * @returns The updated Complaint object
   */
  addComplaintUpdate: async (id: string, text: string, author: string): Promise<Complaint> => {
    Logger.info(`Adding comment update to complaint ${id}`);
    const response = await fetch(`/api/complaints/${id}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, author })
    });
    return handleResponse<Complaint>(response);
  },

  /**
   * Interact with Bapu AI Civic Companion chat.
   * @param message User message prompt
   * @param history Chat history array
   * @param language Targeted translation/output language
   * @returns Promise resolving to the model response text
   */
  sendChatMessage: async (
    message: string,
    history: any[] = [],
    language: string = 'English'
  ): Promise<{ text: string }> => {
    Logger.info('Sending chat message to Bapu companion');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language })
    });
    return handleResponse<{ text: string }>(response);
  },

  /**
   * Simplify a government policy/scheme.
   * @param schemeText Government scheme details or name
   * @param language Target translation language
   * @returns Promise resolving to the markdown simplified response
   */
  simplifyScheme: async (
    schemeText: string,
    language: string = 'English'
  ): Promise<{ text: string }> => {
    Logger.info('Requesting policy simplification', schemeText.substring(0, 30));
    const response = await fetch('/api/simplify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeText, language })
    });
    return handleResponse<{ text: string }>(response);
  },

  /**
   * Draft an official grievance letter/petition.
   * @param issueType Type of issue (e.g. "Potholes & Road Repairs")
   * @param details Specific issue details
   * @param location Geo location of the issue
   * @param citizenName Name of petitioning citizen
   * @param language Target drafting language
   * @returns Promise resolving to the drafted letter markdown
   */
  draftLetter: async (
    issueType: string,
    details: string,
    location: string,
    citizenName: string,
    language: string = 'English'
  ): Promise<{ text: string }> => {
    Logger.info('Requesting official draft letter creation');
    const response = await fetch('/api/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueType, details, location, citizenName, language })
    });
    return handleResponse<{ text: string }>(response);
  },

  /**
   * Generate text-to-speech audio via Gemini model.
   * @param text Text to speak
   * @param voice Voice profile name
   * @returns Base64 encoded audio data
   */
  generateTts: async (text: string, voice: string = 'Kore'): Promise<{ audio: string }> => {
    Logger.info('Generating TTS speech audio');
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice })
    });
    return handleResponse<{ audio: string }>(response);
  }
};
