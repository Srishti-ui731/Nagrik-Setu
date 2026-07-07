import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { Logger } from './src/utils/logger';

dotenv.config();

/**
 * In-memory database of registered public grievances / complaints.
 * Pre-populated with realistic Indian local civic issues for presentation.
 */
let mockComplaints = [
  {
    id: 'COMP-2026-001',
    category: 'Potholes & Road Repairs',
    title: 'Severe Pot-holes on Outer Ring Road, Near Marathahalli flyover',
    description:
      'Deep potholes have appeared right after the flyover ramp, causing major traffic blocks and minor two-wheeler accidents during rainy evenings. Water logging hides these craters completely.',
    location: 'Outer Ring Road (Near Flyover), Marathahalli, Bengaluru',
    state: 'Karnataka',
    pincode: '560037',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-07-02T10:15:00Z',
    citizenName: 'Siddharth Rao',
    citizenPhone: '9845012345',
    citizenEmail: 'siddharth.r@example.com',
    department: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    trackingTimeline: [
      {
        status: 'submitted',
        label: 'Grievance Logged',
        date: 'July 2, 2026',
        description: 'Complaint filed successfully with ID COMP-2026-001',
        active: true
      },
      {
        status: 'assigned',
        label: 'Engineer Appointed',
        date: 'July 3, 2026',
        description: 'Assigned to BBMP Mahadevapura Division Asst. Executive Engineer',
        active: true
      },
      {
        status: 'investigating',
        label: 'Site Inspection Completed',
        date: 'July 4, 2026',
        description: 'Road condition inspected; repair team scheduled',
        active: true
      },
      {
        status: 'in_progress',
        label: 'Work In Progress',
        date: 'July 5, 2026',
        description: 'Temporary cold-mix tar patching initiated under bridge',
        active: true
      },
      {
        status: 'resolved',
        label: 'Resolved & Closed',
        date: '',
        description: 'Repairs completed and certified by ward inspector',
        active: false
      }
    ],
    updates: [
      {
        date: 'July 3, 2026',
        text: 'Complaint assigned to Assistant Executive Engineer, Ward 85.',
        author: 'BBMP Grievance Cell'
      },
      {
        date: 'July 4, 2026',
        text: 'Site inspection done. Found 4 deep potholes measuring more than 6 inches in depth. Slated for midnight patching to prevent traffic congestion.',
        author: 'Er. Ramesh Gowda (AEE)'
      },
      {
        date: 'July 5, 2026',
        text: 'Cold mix materials delivered. Work ongoing for flyover ramp.',
        author: 'Patching Crew (Supervisor)'
      }
    ]
  },
  {
    id: 'COMP-2026-002',
    category: 'Street Lights & Safety',
    title: 'Entire Row of Street Lights Blown Out on Main Sector Road',
    description:
      'Street lights from House 45 to 110 are completely non-functional for the past 6 days. The street is in total darkness after 7 PM, creating safety concerns for children and elderly residents.',
    location: 'Sector-4, HSR Layout (Near BDA Complex)',
    state: 'Karnataka',
    pincode: '560102',
    status: 'assigned',
    priority: 'medium',
    createdAt: '2026-07-04T14:30:00Z',
    citizenName: 'Meenakshi Sundaram',
    citizenPhone: '9123456780',
    citizenEmail: 'meena.sundar@example.com',
    department: 'Bescom Electric Division',
    trackingTimeline: [
      {
        status: 'submitted',
        label: 'Grievance Logged',
        date: 'July 4, 2026',
        description: 'Complaint filed successfully with ID COMP-2026-002',
        active: true
      },
      {
        status: 'assigned',
        label: 'Technician Dispatched',
        date: 'July 5, 2026',
        description: 'Assigned to Sector-4 maintenance field squad',
        active: true
      },
      {
        status: 'investigating',
        label: 'Inspection Pending',
        date: '',
        description: 'Assessing if feeder line or bulbs need replacement',
        active: false
      },
      {
        status: 'in_progress',
        label: 'Repair Work',
        date: '',
        description: 'Repairing underground cabling / installing new LED bulbs',
        active: false
      },
      {
        status: 'resolved',
        label: 'Resolved',
        date: '',
        description: 'Lights functional, verified by resident signoff',
        active: false
      }
    ],
    updates: [
      {
        date: 'July 5, 2026',
        text: 'Work order #WS-9901 issued for replacing the circuit box fuse near the sub-station.',
        author: 'BESCOM Control Room'
      }
    ]
  },
  {
    id: 'COMP-2026-003',
    category: 'Water Supply & Sewage',
    title: 'Drinking Water Supply contaminated with Sewerage Odor',
    description:
      'For the last two municipal supply cycles, the drinking water supplied from 6 AM to 7 AM has a foul sewer smell and is dark yellow in color. Residents are unable to use this even for cleaning.',
    location: 'Pocket C-7, Vasant Kunj',
    state: 'Delhi',
    pincode: '110070',
    status: 'submitted',
    priority: 'high',
    createdAt: '2026-07-06T08:12:00Z',
    citizenName: 'Amit Kumar Sharma',
    citizenPhone: '9910088221',
    citizenEmail: 'sharma.amit@example.com',
    department: 'Delhi Jal Board (DJB)',
    trackingTimeline: [
      {
        status: 'submitted',
        label: 'Grievance Logged',
        date: 'July 6, 2026',
        description: 'Complaint filed successfully with ID COMP-2026-003',
        active: true
      },
      {
        status: 'assigned',
        label: 'Engineer Appointed',
        date: '',
        description: 'Awaiting assignment by DJB zonal office',
        active: false
      },
      {
        status: 'investigating',
        label: 'Water Quality Testing',
        date: '',
        description: 'Water sample collection and testing at pipeline joint',
        active: false
      },
      {
        status: 'in_progress',
        label: 'Pipeline Rectification',
        date: '',
        description: 'Repairing sewage leakage mixing point',
        active: false
      },
      {
        status: 'resolved',
        label: 'Resolved',
        date: '',
        description: 'Supply restored clean and safe',
        active: false
      }
    ],
    updates: [
      {
        date: 'July 6, 2026',
        text: 'Grievance generated and auto-routed to Ward 30 Jal Board supervisor.',
        author: 'DJB Automated System'
      }
    ]
  }
];

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore: Record<string, RateLimitEntry> = {};

/**
 * Custom in-memory rate-limiter middleware.
 * Limits users to 30 requests per 10 minutes per IP for GenAI routes.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 * @param {express.NextFunction} next - The Express next middleware callback
 * @returns {any} Returns response if rate limit is exceeded
 */
const rateLimiter = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): any => {
  const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
  const now = Date.now();
  const limitWindowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 30;

  if (!rateLimitStore[ip] || now > rateLimitStore[ip].resetTime) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + limitWindowMs
    };
    return next();
  }

  rateLimitStore[ip].count += 1;

  if (rateLimitStore[ip].count > maxRequests) {
    Logger.warn(`Rate limit exceeded for IP: ${ip} on route ${req.originalUrl}`);
    return res.status(429).json({
      error: 'Too many requests. Please try again after 10 minutes.'
    });
  }

  next();
};

/**
 * Express middleware to configure essential security headers.
 * Protects against Clickjacking, MIME sniffing, and cross-origin leakage.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 * @param {express.NextFunction} next - The Express next middleware callback
 */
const securityHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Custom CORS rule: limit cross-origin resource sharing to localhost/app domain
  const origin = req.headers.origin;
  if (origin) {
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'null');
    }
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }

  next();
};

interface CacheEntry {
  data: any;
  expiry: number;
}

const responseCache: Record<string, CacheEntry> = {};

/**
 * Retrieves cached response value if it has not expired yet.
 *
 * @param {string} key - Cache mapping key
 * @returns {any | null} The cached response data or null if not found or expired
 */
const getCache = (key: string): any | null => {
  const entry = responseCache[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
};

/**
 * Stores a response payload in the local memory cache.
 *
 * @param {string} key - Cache mapping key
 * @param {any} data - Data structure to cache
 * @param {number} [ttlMs=600000] - Duration in milliseconds (default 10 minutes)
 */
const setCache = (key: string, data: any, ttlMs: number = 10 * 60 * 1000) => {
  responseCache[key] = {
    data,
    expiry: Date.now() + ttlMs
  };
};

/**
 * Express handler to retrieve all registered civic complaints.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 */
export const getComplaints = (req: express.Request, res: express.Response) => {
  res.json(mockComplaints);
};

/**
 * Express handler to register a new civic complaint.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 * @returns {any} Returns validation error response or newly created complaint
 */
export const submitComplaint = (req: express.Request, res: express.Response): any => {
  const {
    category,
    title,
    description,
    location,
    state,
    pincode,
    priority,
    citizenName,
    citizenPhone,
    citizenEmail,
    department
  } = req.body;

  // 1. Check for required parameters
  if (!category || !title || !description || !location || !citizenName) {
    return res.status(400).json({ error: 'Missing required fields for registering complaint' });
  }

  // 2. Title validation (length between 5 and 100 characters)
  if (title.length < 5 || title.length > 100) {
    return res.status(400).json({ error: 'Title must be between 5 and 100 characters long.' });
  }

  // 3. Description validation (length between 10 and 1000 characters)
  if (description.length < 10 || description.length > 1000) {
    return res
      .status(400)
      .json({ error: 'Detailed description must be between 10 and 1000 characters long.' });
  }

  // 4. Validate PIN code format (exactly 6 digits numeric)
  const pincodeRegex = /^\d{6}$/;
  if (pincode && !pincodeRegex.test(pincode)) {
    return res.status(400).json({ error: 'Pincode must be exactly 6 numeric digits.' });
  }

  // 5. Validate citizen email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (citizenEmail && !emailRegex.test(citizenEmail)) {
    return res.status(400).json({ error: 'Please specify a valid email address.' });
  }

  // 6. Validate citizen phone format
  const phoneRegex = /^\+?[\d\s\-]{10,15}$/;
  if (citizenPhone && !phoneRegex.test(citizenPhone)) {
    return res.status(400).json({ error: 'Please specify a valid phone number (10-15 digits).' });
  }

  const newId = `COMP-2026-00${mockComplaints.length + 1}`;
  const newComplaint = {
    id: newId,
    category,
    title,
    description,
    location,
    state: state || 'Karnataka',
    pincode: pincode || '560001',
    status: 'submitted' as const,
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    citizenName,
    citizenPhone: citizenPhone || '9900000000',
    citizenEmail: citizenEmail || 'citizen@bharat.in',
    department: department || 'Local Municipal Authority',
    trackingTimeline: [
      {
        status: 'submitted',
        label: 'Grievance Logged',
        date: 'July 6, 2026',
        description: `Complaint filed successfully with ID ${newId}`,
        active: true
      },
      {
        status: 'assigned',
        label: 'Engineer Appointed',
        date: '',
        description: 'Awaiting engineer/officer assignment',
        active: false
      },
      {
        status: 'investigating',
        label: 'Site Inspection',
        date: '',
        description: 'Assessing ground situation',
        active: false
      },
      {
        status: 'in_progress',
        label: 'Repair Work',
        date: '',
        description: 'Work under execution',
        active: false
      },
      {
        status: 'resolved',
        label: 'Resolved & Closed',
        date: '',
        description: 'Resolution certified',
        active: false
      }
    ],
    updates: [
      {
        date: 'July 6, 2026',
        text: 'Grievance filed on portal. Automated tracking initialized.',
        author: 'Citizen Portal'
      }
    ]
  };

  mockComplaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
};

/**
 * Express handler to add a comment update/note to a complaint.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 * @returns {any} Returns validation or updated complaint response
 */
export const addComplaintUpdate = (req: express.Request, res: express.Response): any => {
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).json({ error: 'Update text and author are required' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Status note cannot exceed 500 characters.' });
  }

  const complaint = mockComplaints.find((c) => c.id === id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const newUpdate = {
    date: 'July 6, 2026',
    text,
    author
  };

  complaint.updates.unshift(newUpdate);

  // Auto advance statuses for testing/presentation if citizen adds notes
  if (complaint.status === 'submitted') {
    complaint.status = 'assigned';
    complaint.trackingTimeline[1].active = true;
    complaint.trackingTimeline[1].date = 'July 6, 2026';
  } else if (complaint.status === 'assigned') {
    complaint.status = 'investigating';
    complaint.trackingTimeline[2].active = true;
    complaint.trackingTimeline[2].date = 'July 6, 2026';
  } else if (complaint.status === 'investigating') {
    complaint.status = 'in_progress';
    complaint.trackingTimeline[3].active = true;
    complaint.trackingTimeline[3].date = 'July 6, 2026';
  }

  res.status(200).json(complaint);
};

/**
 * Express handler to send a message to the Gemini AI chatbot backend.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 */
export const sendChatMessage = async (req: express.Request, res: express.Response) => {
  try {
    const { message, history = [], language = 'English' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 800) {
      return res.status(400).json({ error: 'Prompt exceeds the limit of 800 characters.' });
    }

    const cacheKey = `chat:${language}:${message}:${JSON.stringify(history)}`;
    const cachedResponse = getCache(cacheKey);
    if (cachedResponse) {
      Logger.info('Cache hit for sendChatMessage');
      return res.json({ text: cachedResponse });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on server.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Prepare contents list
    const chatContents = history.map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemInstruction = `You are 'Bapu / Bharat Sevak', an expert, deeply compassionate, and highly supportive AI Civic Companion designed to assist the citizens of Bharat (India) in accessing government resources, navigating bureaucratic procedures, understanding their digital rights, and resolving public grievances.

Key Guidelines:
1. Simplify complex public welfare schemes (like PM-KISAN, Ayushman Bharat, PMJDY, pensions, ration cards), bureaucratic acts, and guidelines into clear, non-jargon, and comforting terms.
2. Structure your replies beautifully with bullet points, numbered lists, and bold headings to guarantee accessibility.
3. The citizen prefers communicating in ${language}. Ensure your primary response is in ${language}, but you can include English terms or names of schemes in parentheses where they are officially designated in English (e.g. "Ayushman Bharat Card (आयुष्मान भारत कार्ड)").
4. Offer digital inclusion: write with utmost patience, address the citizen respectfully (e.g. "Namaste", "Dear Citizen", or use localized honorifics), and explain technical details (like OTP verification, Aadhaar linking, or downloading from Digilocker) in simple, step-by-step guides.
5. If requested, provide direct templates of application letters, Grievance reports, or official petitions formatted correctly for Indian government blocks, Panchayat boards, or municipal corporations.
6. Keep answers informative, factual, and strictly accurate. Base your recommendations on real, active government pathways. Do NOT invent schemes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatContents.map((c) => ({
        role: c.role === 'user' ? 'user' : 'model',
        parts: c.parts
      })),
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    setCache(cacheKey, response.text);
    res.json({ text: response.text });
  } catch (error: any) {
    Logger.error('Chat proxy error', error);
    res.status(500).json({ error: 'Error generating AI response. Please try again later.' });
  }
};

/**
 * Express handler to simplify a welfare scheme using the Gemini AI model.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 */
export const simplifyScheme = async (req: express.Request, res: express.Response) => {
  try {
    const { schemeText, language = 'English' } = req.body;
    if (!schemeText) {
      return res.status(400).json({ error: 'Scheme text or name is required' });
    }

    if (schemeText.length > 1500) {
      return res.status(400).json({ error: 'Scheme text exceeds limits.' });
    }

    const cacheKey = `simplify:${language}:${schemeText}`;
    const cachedResponse = getCache(cacheKey);
    if (cachedResponse) {
      Logger.info('Cache hit for simplifyScheme');
      return res.json({ text: cachedResponse });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on server' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Please read this government welfare scheme/policy text and simplify it completely for a common Indian citizen who might not have high formal education.

Scheme Text / Topic: ${schemeText}
Language to simplify in: ${language}

Format the output cleanly in Markdown with these specific sections:
1. **📌 Overview**: A single sentence explaining what this is in the simplest possible language.
2. **💡 Primary Benefits**: Bullet points of EXACTLY what the citizen gets (e.g., money, insurance cover, grains).
3. **🎯 Eligibility Criteria**: Clear, unambiguous list of who can apply (and who cannot, in plain terms).
4. **📋 Documents Required Checklist**: A checklist of certificates, IDs, and proofs needed.
5. **⚙️ Step-by-Step How To Apply**: Extremely simple steps to apply online, offline, or via CSC (Common Service Center).
6. **⚠️ Common Pitfalls**: 2-3 short items to watch out for (e.g., Aadhaar mobile link, bank account active).`
    });

    setCache(cacheKey, response.text);
    res.json({ text: response.text });
  } catch (error: any) {
    Logger.error('Simplify error', error);
    res.status(500).json({ error: 'Error simplifying scheme details. Please try again later.' });
  }
};

/**
 * Express handler to draft an official grievance petition using Gemini AI.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 */
export const draftLetter = async (req: express.Request, res: express.Response) => {
  try {
    const { issueType, details, location, citizenName, language = 'English' } = req.body;
    if (!issueType || !details) {
      return res.status(400).json({ error: 'Issue type and details are required' });
    }

    if (details.length > 1000) {
      return res.status(400).json({ error: 'Details text exceeds limits.' });
    }

    const cacheKey = `draft:${language}:${issueType}:${details}:${location}:${citizenName}`;
    const cachedResponse = getCache(cacheKey);
    if (cachedResponse) {
      Logger.info('Cache hit for draftLetter');
      return res.json({ text: cachedResponse });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on server' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Draft a formal official grievance letter/application in Indian English or ${language} (with dual format if applicable) to be submitted to the local government authority.

Details of issue:
- **Authority Type**: e.g., Municipal Commissioner, Panchayat President, Ward Officer, Electricity Board Engineer
- **Grievance Category**: ${issueType}
- **Specific Details**: ${details}
- **Location**: ${location}
- **Citizen Name**: ${citizenName}

Please design the letter/petition according to standard Indian official writing etiquette. Include standard fields:
- To (with a placeholder for authority designation)
- Subject (uncluttered and clear)
- Salutation (Respected Sir/Madam)
- Body (comprising 2-3 short, powerful, and respectful paragraphs outlining the hazard, duration of distress, and requested immediate remedy)
- Formal ending (Thanking you, Yours faithfully, Signature block)
- Attached supporting items (e.g., location coordinates, photographs, citizen list).`
    });

    setCache(cacheKey, response.text);
    res.json({ text: response.text });
  } catch (error: any) {
    Logger.error('Draft error', error);
    res.status(500).json({ error: 'Error generating draft petition. Please try again later.' });
  }
};

/**
 * Express handler to generate Text-to-Speech audio data using Gemini TTS.
 *
 * @param {express.Request} req - The Express request object
 * @param {express.Response} res - The Express response object
 */
export const generateTts = async (req: express.Request, res: express.Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (text.length > 500) {
      return res.status(400).json({ error: 'Text exceeds maximum length for speech conversion.' });
    }

    const cacheKey = `tts:${voice}:${text}`;
    const cachedResponse = getCache(cacheKey);
    if (cachedResponse) {
      Logger.info('Cache hit for generateTts');
      return res.json({ audio: cachedResponse });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Filter text slightly to remove Markdown characters for cleaner reading
    const cleanText = text
      .replace(/[*#`_\-]/g, '') // remove bold, headings, list markers
      .substring(0, 450); // Keep reasonable length for response token safety

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [
        {
          parts: [
            {
              text: `Read the following text clearly and in a helpful, calm, friendly public announcer tone: ${cleanText}`
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice } // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      setCache(cacheKey, base64Audio);
      res.json({ audio: base64Audio });
    } else {
      res.status(500).json({ error: 'No audio generated from Gemini TTS model' });
    }
  } catch (error: any) {
    Logger.error('TTS generation error', error);
    res.status(500).json({ error: 'Error generating speech audio. Please try again later.' });
  }
};

/**
 * Boots the Express server and configures the Vite middleware or static serving.
 * Sets up routing for all public API resources.
 *
 * @returns {Promise<void>} Resolves when the server is online
 */
async function startServer(): Promise<void> {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Global security headers
  app.use(securityHeaders);

  // Rate Limit Application to Paid/Gemini API endpoints
  app.post('/api/chat', rateLimiter);
  app.post('/api/simplify', rateLimiter);
  app.post('/api/draft', rateLimiter);
  app.post('/api/tts', rateLimiter);

  // API Route Registrations
  app.get('/api/complaints', getComplaints);
  app.post('/api/complaints', submitComplaint);
  app.post('/api/complaints/:id/updates', addComplaintUpdate);
  app.post('/api/chat', sendChatMessage);
  app.post('/api/simplify', simplifyScheme);
  app.post('/api/draft', draftLetter);
  app.post('/api/tts', generateTts);

  // Vite Integration & Static Asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    Logger.info(`Nagrik Setu server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
